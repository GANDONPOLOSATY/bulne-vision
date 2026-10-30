import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, SwitchCamera, Zap, ZapOff, AlertCircle, RefreshCw, Upload, Image as ImageIcon, Crosshair } from 'lucide-react';
import { drawHUDOverlay, type DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';
import { triggerHaptic } from '../utils/haptics';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  detections: DetectionResult[];
  language: SupportedLanguage;
  isScanning: boolean;
  onOpenSampleModal: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  staticImageUrl: string | null;
  onClearStaticImage: () => void;
  onSelectDetection?: (det: DetectionResult) => void;
  isGameMode?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  canvasRef,
  detections,
  language,
  isScanning,
  onOpenSampleModal,
  onFileUpload,
  staticImageUrl,
  onClearStaticImage,
  onSelectDetection,
  isGameMode = false,
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [tapFocus, setTapFocus] = useState<{ x: number; y: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startCamera = useCallback(async () => {
    if (staticImageUrl) return;
    setIsStartingCamera(true);
    setCameraError(null);

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities && track.getCapabilities()) as unknown as { torch?: boolean };
      if (capabilities && 'torch' in capabilities) {
        setHasTorch(Boolean(capabilities.torch));
      } else {
        setHasTorch(false);
      }
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      const errorMsg = err instanceof Error ? err.name : 'UnknownError';
      if (errorMsg === 'NotAllowedError' || errorMsg === 'PermissionDeniedError') {
        setCameraError(
          language === 'kz'
            ? 'Камераға рұқсат берілмеді'
            : 'Доступ к камере заблокирован в браузере'
        );
      } else if (errorMsg === 'NotFoundError' || errorMsg === 'DevicesNotFoundError') {
        setCameraError(
          language === 'kz'
            ? 'Камера құрылғысы табылмады'
            : 'Камера не найдена на этом устройстве'
        );
      } else {
        setCameraError(
          language === 'kz'
            ? 'Камераны қосу мүмкін болмады'
            : 'Не удалось запустить камеру'
        );
      }
    } finally {
      setIsStartingCamera(false);
    }
  }, [facingMode, staticImageUrl, videoRef, language]);

  useEffect(() => {
    if (!staticImageUrl) {
      startCamera();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [startCamera, staticImageUrl, videoRef]);

  const toggleTorch = async () => {
    triggerHaptic('medium');
    if (!videoRef.current || !videoRef.current.srcObject) return;
    const stream = videoRef.current.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        const nextTorch = !isTorchOn;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setIsTorchOn(nextTorch);
      } catch (e) {
        console.warn('Torch control failed:', e);
      }
    }
  };

  const switchCameraFacing = () => {
    triggerHaptic('medium');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Tap-to-focus on touch/click
  const handleViewfinderTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setTapFocus({ x, y });
    triggerHaptic('light');

    // Check if user tapped inside any bounding box
    if (canvasRef.current && detections.length > 0) {
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;

      const hit = detections.find((d) => {
        const [bx, by, bw, bh] = d.bbox;
        return canvasX >= bx && canvasX <= bx + bw && canvasY >= by && canvasY <= by + bh;
      });

      if (hit && onSelectDetection) {
        onSelectDetection(hit);
      }
    }

    setTimeout(() => setTapFocus(null), 1200);
  };

  // Sync canvas dimensions and draw HUD
  useEffect(() => {
    if (canvasRef.current && (videoRef.current || staticImageUrl)) {
      drawHUDOverlay(canvasRef.current, detections, language);
    }
  }, [detections, language, canvasRef, videoRef, staticImageUrl]);

  return (
    <div
      ref={containerRef}
      onClick={handleViewfinderTap}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 select-none ${
        isGameMode ? 'ring-2 ring-amber-400/40' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Static image display mode */}
      {staticImageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            id="bulne-static-img"
            src={staticImageUrl}
            alt="Scanned item"
            className="w-full h-full object-contain"
            onLoad={() => {
              const img = document.getElementById('bulne-static-img') as HTMLImageElement;
              if (img && canvasRef.current) {
                canvasRef.current.width = img.clientWidth || 640;
                canvasRef.current.height = img.clientHeight || 480;
              }
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClearStaticImage();
            }}
            className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white border border-slate-700 text-xs font-semibold backdrop-blur-md cursor-pointer transition shadow-lg active:scale-95"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>{language === 'kz' ? 'Камераны қосу' : 'Включить камеру'}</span>
          </button>
        </div>
      ) : (
        /* Live Camera Feed */
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          onLoadedMetadata={() => {
            if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth || 640;
              canvasRef.current.height = videoRef.current.videoHeight || 480;
            }
          }}
          className="w-full h-full object-cover"
        />
      )}

      {/* Canvas HUD overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Animated Sci-Fi Scanline Laser */}
      {isScanning && !cameraError && (
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none z-10 opacity-70" />
      )}

      {/* Tap-to-focus ripple indicator */}
      {tapFocus && (
        <div
          style={{ left: tapFocus.x - 24, top: tapFocus.y - 24 }}
          className="absolute pointer-events-none z-20 w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center animate-ping"
        >
          <div className="w-2 h-2 rounded-full bg-amber-400" />
        </div>
      )}

      {/* Minimalist Viewfinder Reticle Grid */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none z-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg shadow-sm shadow-cyan-400/50" />
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg shadow-sm shadow-cyan-400/50" />
        </div>

        <div className="self-center flex items-center justify-center opacity-40">
          <Crosshair className="w-10 h-10 text-cyan-400 stroke-1" />
        </div>

        <div className="flex justify-between items-end">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg shadow-sm shadow-cyan-400/50" />
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg shadow-sm shadow-cyan-400/50" />
        </div>
      </div>

      {/* Floating Camera Controls (Flip & Torch) */}
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-2.5">
        {!staticImageUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              switchCameraFacing();
            }}
            className="p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-xl shadow-lg active:scale-90 transition cursor-pointer"
            title="Камераны ауыстыру / Сменить камеру"
          >
            <SwitchCamera className="w-5 h-5 text-cyan-300" />
          </button>
        )}

        {hasTorch && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleTorch();
            }}
            className={`p-3 rounded-full border backdrop-blur-xl shadow-lg active:scale-90 transition cursor-pointer ${
              isTorchOn
                ? 'bg-amber-500 border-amber-400 text-slate-950'
                : 'bg-slate-900/80 border-slate-700/80 text-white hover:bg-slate-800'
            }`}
            title="Фонарик"
          >
            {isTorchOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Camera Error / Permission Fallback Overlay */}
      {cameraError && !staticImageUrl && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mb-4 text-red-400 shadow-xl shadow-red-950/40">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{cameraError}</h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
            {language === 'kz'
              ? 'Камераға рұқсат беріңіз немесе үлгі суреттер мен галереяны пайдаланып көріңіз.'
              : 'Разрешите доступ к камере в браузере или проверьте работу с помощью фото.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              disabled={isStartingCamera}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isStartingCamera ? 'animate-spin' : ''}`} />
              <span>{language === 'kz' ? 'Қайта қосу' : 'Повторить'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSampleModal();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{language === 'kz' ? 'Үлгі суреттер' : 'Примеры'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'kz' ? 'Фото жүктеу' : 'Загрузить фото'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
