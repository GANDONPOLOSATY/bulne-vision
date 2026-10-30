import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { CameraView } from './components/CameraView';
import { IdentificationCard } from './components/IdentificationCard';
import { ControlsDeck } from './components/ControlsDeck';
import { GameHUD } from './components/GameHUD';
import { HistoryDrawer, type HistoryItem } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { SampleGalleryModal } from './components/SampleGalleryModal';
import type { SampleImage } from './data/sampleImages';
import {
  loadVisionModel,
  detectObjects,
  type DetectionResult,
} from './utils/detectorService';
import {
  type SupportedLanguage,
  type SpeechSettings,
  DEFAULT_SPEECH_SETTINGS,
  speakText,
  stopSpeaking,
} from './utils/speechService';
import {
  playDetectionChime,
  playShutterSound,
  playTriumphSound,
  unlockAudio,
} from './utils/audioSynth';
import {
  type Quest,
  getRandomQuest,
  getQuestPrompt,
  getSuccessMessage,
} from './utils/gameService';
import { triggerHaptic } from './utils/haptics';
import { Loader2 } from 'lucide-react';

export function App() {
  // App state
  const [language, setLanguage] = useState<SupportedLanguage>('kz');
  const [isMuted, setIsMuted] = useState(false);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>(() => {
    const saved = localStorage.getItem('bulne_speech_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      ...DEFAULT_SPEECH_SETTINGS,
      elevenLabsApiKey: 'sk_b3a712c6f43f7255a1fb17102a84c8966619e8226017ba33',
    };
  });

  const [confidenceThreshold, setConfidenceThreshold] = useState(0.45);
  const [isAutoScan, setIsAutoScan] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelLoadingStatus, setModelLoadingStatus] = useState<string | null>(
    'Модель жүктелуде... / Загрузка модели...'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  // Game Mode state
  const [isGameMode, setIsGameMode] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [isWon, setIsWon] = useState(false);

  // Detections & View state
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [primaryDetection, setPrimaryDetection] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [staticImageUrl, setStaticImageUrl] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isLoopActive = useRef(false);
  const detectionLock = useRef(false);

  // Save settings on update
  useEffect(() => {
    localStorage.setItem('bulne_speech_settings', JSON.stringify(speechSettings));
  }, [speechSettings]);

  // Load Vision AI model on boot
  useEffect(() => {
    let mounted = true;
    loadVisionModel((status) => {
      if (mounted) setModelLoadingStatus(status);
    })
      .then(() => {
        if (mounted) setModelLoadingStatus(null);
      })
      .catch((err) => {
        console.error('Failed to load TFJS vision model:', err);
        if (mounted) setModelLoadingStatus('Модель жүктелмеді / Ошибка загрузки');
      });

    return () => {
      mounted = false;
      stopSpeaking();
    };
  }, []);

  // Unlock audio on first global touch
  useEffect(() => {
    const handleFirstTouch = () => {
      unlockAudio();
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
    window.addEventListener('touchstart', handleFirstTouch, { passive: true });
    window.addEventListener('click', handleFirstTouch);
    return () => {
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  // Trigger speech for primary detection
  const speakDetection = useCallback(
    async (detection: DetectionResult, force = false, rate?: number) => {
      if (isMuted) return;

      const phrase =
        language === 'kz'
          ? detection.knowledge.spokenKz
          : language === 'ru'
          ? detection.knowledge.spokenRu
          : detection.knowledge.spokenEn;

      setIsSpeaking(true);
      await speakText(
        phrase,
        { ...speechSettings, language },
        { force, debounceMs: 6500, rate }
      );
      setIsSpeaking(false);
    },
    [isMuted, language, speechSettings]
  );

  const handleToggleFreeze = () => {
    triggerHaptic('medium');
    if (!isFrozen) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsFrozen(true);
    } else {
      if (videoRef.current) {
        videoRef.current.play();
      }
      setIsFrozen(false);
    }
  };

  // Initialize or change Quest in Game Mode
  const initNextQuest = useCallback((exclude?: string) => {
    const q = getRandomQuest(exclude);
    setCurrentQuest(q);
    setIsWon(false);

    if (!isMuted) {
      const prompt = getQuestPrompt(q, language);
      speakText(prompt.spoken, { ...speechSettings, language }, { force: true });
    }
  }, [language, isMuted, speechSettings]);

  useEffect(() => {
    if (isGameMode && !currentQuest) {
      initNextQuest();
    }
  }, [isGameMode, currentQuest, initNextQuest]);

  // Process game victory
  const handleGameMatch = useCallback(
    async (matchedQuest: Quest) => {
      if (isWon) return;
      setIsWon(true);
      triggerHaptic('success');
      playTriumphSound();

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00e5ff', '#fbbf24', '#34d399', '#f43f5e'],
      });

      setScore((prev) => prev + matchedQuest.points * streak);
      setStreak((prev) => prev + 1);

      if (!isMuted) {
        const msg = getSuccessMessage(matchedQuest, language);
        speakText(msg, { ...speechSettings, language }, { force: true });
      }

      setTimeout(() => {
        initNextQuest(matchedQuest.targetId);
      }, 2600);
    },
    [isWon, streak, isMuted, language, speechSettings, initNextQuest]
  );

  // Process frame detection
  const processFrame = useCallback(
    async (element: HTMLVideoElement | HTMLImageElement, isManual = false) => {
      if (detectionLock.current) return;
      detectionLock.current = true;

      try {
        const results = await detectObjects(element, confidenceThreshold);
        setDetections(results);

        if (results.length > 0) {
          const top = results[0];
          setPrimaryDetection(top);

          // Check Game Mode target match
          if (isGameMode && currentQuest && !isWon) {
            const hasTarget = results.some((d) => {
              const normClass = d.class.toLowerCase().replace(/\s+/g, '_');
              const targetNorm = currentQuest.targetId.toLowerCase().replace(/\s+/g, '_');
              return normClass === targetNorm || d.knowledge.id === targetNorm;
            });

            if (hasTarget) {
              handleGameMatch(currentQuest);
              return;
            }
          }

          // Scanner Mode
          if (!isGameMode) {
            const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            setHistory((prev) => {
              if (prev.length > 0 && prev[0].detection.class === top.class) {
                return prev;
              }
              return [
                {
                  id: `${top.class}_${Date.now()}`,
                  timestamp: nowStr,
                  detection: top,
                },
                ...prev.slice(0, 49),
              ];
            });

            playDetectionChime();

            if (isManual || isAutoScan) {
              speakDetection(top, isManual);
            }

            if (isManual) {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#00e5ff', '#38bdf8', '#f59e0b'],
              });
            }
          }
        }
      } catch (err) {
        console.error('Frame processing failed:', err);
      } finally {
        detectionLock.current = false;
      }
    },
    [
      confidenceThreshold,
      isAutoScan,
      isGameMode,
      currentQuest,
      isWon,
      handleGameMatch,
      speakDetection,
    ]
  );

  // Auto-scan loop
  useEffect(() => {
    isLoopActive.current =
      (isAutoScan || isGameMode) && !staticImageUrl && !modelLoadingStatus && !isFrozen;

    const interval = setInterval(() => {
      if (
        isLoopActive.current &&
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        !isFrozen
      ) {
        processFrame(videoRef.current, false);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [isAutoScan, isGameMode, staticImageUrl, modelLoadingStatus, isFrozen, processFrame]);

  const handleManualScan = async () => {
    playShutterSound();
    setIsDetecting(true);

    if (staticImageUrl) {
      const img = document.getElementById('bulne-static-img') as HTMLImageElement;
      if (img) {
        await processFrame(img, true);
      }
    } else if (videoRef.current && videoRef.current.readyState >= 2) {
      await processFrame(videoRef.current, true);
    }
    setIsDetecting(false);
  };

  const handleReplayCurrent = (rate?: number) => {
    if (primaryDetection) {
      speakDetection(primaryDetection, true, rate);
    }
  };

  const handleSelectSample = (sample: SampleImage) => {
    setStaticImageUrl(sample.src);
    setTimeout(() => {
      const img = document.getElementById('bulne-static-img') as HTMLImageElement;
      if (img) {
        processFrame(img, true);
      }
    }, 200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setStaticImageUrl(event.target.result as string);
          setTimeout(() => {
            const img = document.getElementById('bulne-static-img') as HTMLImageElement;
            if (img) {
              processFrame(img, true);
            }
          }, 200);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearStaticImage = () => {
    setStaticImageUrl(null);
    setDetections([]);
    setPrimaryDetection(null);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#070a12] text-slate-100 overflow-hidden select-none flex flex-col justify-between">
      {/* Top Header Floating Bar */}
      <Header
        language={language}
        setLanguage={setLanguage}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        isGameMode={isGameMode}
        setIsGameMode={setIsGameMode}
      />

      {/* Fullscreen Camera Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          detections={detections}
          selectedDetection={primaryDetection}
          language={language}
          isScanning={isAutoScan || isGameMode}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onFileUpload={handleFileUpload}
          staticImageUrl={staticImageUrl}
          onClearStaticImage={clearStaticImage}
          onSelectDetection={(det) => {
            setPrimaryDetection(det);
            speakDetection(det, true);
          }}
          isGameMode={isGameMode}
          isFrozen={isFrozen}
          onToggleFreeze={handleToggleFreeze}
        />
      </div>

      {/* Model Loading Status Pill */}
      {modelLoadingStatus && (
        <div className="absolute top-16 left-4 right-4 z-20 max-w-sm mx-auto p-2.5 rounded-full bg-slate-950/80 border border-cyan-500/40 backdrop-blur-xl flex items-center justify-center gap-2 text-xs text-cyan-300 shadow-xl">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>{modelLoadingStatus}</span>
        </div>
      )}

      {/* Game Mode Quest HUD */}
      {isGameMode && (
        <GameHUD
          quest={currentQuest}
          score={score}
          streak={streak}
          onSkipQuest={() => {
            setStreak(1);
            initNextQuest(currentQuest?.targetId);
          }}
          onPlayQuestPrompt={() => {
            if (currentQuest) {
              const p = getQuestPrompt(currentQuest, language);
              speakText(p.spoken, { ...speechSettings, language }, { force: true });
            }
          }}
          language={language}
          isWon={isWon}
        />
      )}

      {/* Spacer to push controls to bottom */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Floating Control Dock */}
      <div className="relative z-20 w-full flex flex-col items-center gap-2 pb-safe">
        {/* Identified Object Card (Scanner Mode only) */}
        {!isGameMode && (
          <IdentificationCard
            detection={primaryDetection}
            allDetections={detections}
            onSelectDetection={(det) => {
              setPrimaryDetection(det);
              speakDetection(det, true);
            }}
            language={language}
            onReplaySpeech={handleReplayCurrent}
            isSpeaking={isSpeaking}
          />
        )}

        {/* Tactile Control Buttons */}
        <ControlsDeck
          onScanNow={handleManualScan}
          isAutoScan={isAutoScan}
          setIsAutoScan={setIsAutoScan}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onTriggerFileUpload={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
          language={language}
          isDetecting={isDetecting}
          isGameMode={isGameMode}
        />
      </div>

      {/* Drawers and Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onPlaySpeech={(item) => speakDetection(item.detection, true)}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={speechSettings}
        onSaveSettings={setSpeechSettings}
        confidenceThreshold={confidenceThreshold}
        setConfidenceThreshold={setConfidenceThreshold}
      />

      <SampleGalleryModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
        language={language}
      />
    </div>
  );
}

export default App;
