import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { CameraView } from './components/CameraView';
import { IdentificationCard } from './components/IdentificationCard';
import { ControlsDeck } from './components/ControlsDeck';
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
import { playDetectionChime, playShutterSound } from './utils/audioSynth';
import { Sparkles, Loader2 } from 'lucide-react';

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
      elevenLabsApiKey: 'sk_b3a712c6f43f7255a1fb17102a84c8966619e8226017ba33', // Default loaded from workspace env
    };
  });

  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isAutoScan, setIsAutoScan] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [modelLoadingStatus, setModelLoadingStatus] = useState<string | null>(
    'Модель жүктелуде... / Загрузка модели...'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Detections & View state
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [primaryDetection, setPrimaryDetection] = useState<DetectionResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [staticImageUrl, setStaticImageUrl] = useState<string | null>(null);

  // Modals & Drawers
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

  // Trigger speech for primary detection
  const speakDetection = useCallback(
    async (detection: DetectionResult, force = false) => {
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
        { force, debounceMs: 7000 }
      );
      setIsSpeaking(false);
    },
    [isMuted, language, speechSettings]
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

          // Add to history
          const nowStr = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          setHistory((prev) => {
            // Avoid adding identical consecutive item within 5 seconds
            const last = prev[0];
            if (last && last.detection.class === top.class) {
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
      } catch (err) {
        console.error('Frame processing failed:', err);
      } finally {
        detectionLock.current = false;
      }
    },
    [confidenceThreshold, isAutoScan, speakDetection]
  );

  // Auto-scan loop for live video
  useEffect(() => {
    isLoopActive.current = isAutoScan && !staticImageUrl && !modelLoadingStatus;

    const interval = setInterval(() => {
      if (
        isLoopActive.current &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        processFrame(videoRef.current, false);
      }
    }, 850);

    return () => clearInterval(interval);
  }, [isAutoScan, staticImageUrl, modelLoadingStatus, processFrame]);

  // Manual Trigger: User taps the shutter button "Бұл не? Сканерлеу"
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

  // Replay speech for currently locked object
  const handleReplayCurrent = () => {
    if (primaryDetection) {
      speakDetection(primaryDetection, true);
    }
  };

  // Select sample image from gallery
  const handleSelectSample = (sample: SampleImage) => {
    setStaticImageUrl(sample.src);
    setTimeout(() => {
      const img = document.getElementById('bulne-static-img') as HTMLImageElement;
      if (img) {
        processFrame(img, true);
      }
    }, 200);
  };

  // Upload local photo file
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
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header
        language={language}
        setLanguage={setLanguage}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Vision Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-start">
        {/* Loading overlay for AI model */}
        {modelLoadingStatus && (
          <div className="w-full max-w-4xl mx-auto mb-4 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between text-xs sm:text-sm text-cyan-300 backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>{modelLoadingStatus}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">COCO-SSD • TFJS</span>
          </div>
        )}

        {/* Viewfinder Section */}
        <CameraView
          videoRef={videoRef}
          canvasRef={canvasRef}
          detections={detections}
          language={language}
          isScanning={isAutoScan}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
          onFileUpload={handleFileUpload}
          staticImageUrl={staticImageUrl}
          onClearStaticImage={clearStaticImage}
        />

        {/* Identification Result Card */}
        <IdentificationCard
          detection={primaryDetection}
          language={language}
          onReplaySpeech={handleReplayCurrent}
          isSpeaking={isSpeaking}
        />

        {/* Control Deck */}
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
        />
      </main>

      {/* Modals and Drawers */}
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

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-900 bg-slate-950/40">
        <div className="flex items-center justify-center gap-2">
          <span>BulNe? — Ақылды көру және сөйлеу жүйесі</span>
          <span>•</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 100% Локальді & Қауіпсіз
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;