import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, SwitchCamera, Zap, ZapOff, AlertCircle, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';
import { drawHUDOverlay, type DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';

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
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    if (staticImageUrl) return;
    setIsStartingCamera(true);
    setCameraError(null);

    // Stop existing tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Check for torch capability
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
        setCameraError('Камераға рұқсат берілмеді / Доступ к камере заблокирован');
      } else if (errorMsg === 'NotFoundError' || errorMsg === 'DevicesNotFoundError') {
        setCameraError('Камера құрылғысы табылмады / Камера не найдена на устройстве');
      } else {
        setCameraError('Камераны қосу мүмкін болмады / Не удалось запустить камеру');
      }
    } finally {
      setIsStartingCamera(false);
    }
  }, [facingMode, staticImageUrl, videoRef]);

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

  // Toggle torch/flashlight
  const toggleTorch = async () => {
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

  // Flip front/rear camera
  const switchCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Render canvas overlays whenever detections change
  useEffect(() => {
    if (canvasRef.current && (videoRef.current || staticImageUrl)) {
      drawHUDOverlay(canvasRef.current, detections, language);
    }
  }, [detections, language, canvasRef, videoRef, staticImageUrl]);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[70vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl shadow-cyan-950/20 group">
      {/* Hidden file input */}
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
              // Update canvas dimension when image loads
              const img = document.getElementById('bulne-static-img') as HTMLImageElement;
              if (img && canvasRef.current) {
                canvasRef.current.width = img.clientWidth;
                canvasRef.current.height = img.clientHeight;
              }
            }}
          />
          {/* Return to live camera button */}
          <button
            onClick={onClearStaticImage}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold backdrop-blur-md cursor-pointer transition"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Камераға оралу / Включить камеру</span>
          </button>
        </div>
      ) : (
        /* Video Stream */
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
          className="w-full h-full object-cover transform transition-transform"
        />
      )}

      {/* Canvas HUD overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Cyber Viewfinder Reticle Frame */}
      <div className="absolute inset-4 pointer-events-none z-10 border border-slate-500/20 rounded-xl flex flex-col justify-between p-3">
        {/* Corners */}
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg shadow-sm shadow-cyan-400/50" />
          <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg shadow-sm shadow-cyan-400/50" />
        </div>

        {/* Center reticle */}
        <div className="self-center flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center animate-pulse-ring">
            <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
          </div>
        </div>

        {/* Bottom Corners */}
        <div className="flex justify-between items-end">
          <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg shadow-sm shadow-cyan-400/50" />
          <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg shadow-sm shadow-cyan-400/50" />
        </div>
      </div>

      {/* Animated Sci-Fi Scanline Laser */}
      {isScanning && !cameraError && (
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none z-10 opacity-70" />
      )}

      {/* Top Floating Controls on Camera */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Torch toggle */}
        {hasTorch && (
          <button
            onClick={toggleTorch}
            className={`p-2.5 rounded-full backdrop-blur-md border transition cursor-pointer ${
              isTorchOn
                ? 'bg-amber-500/80 border-amber-400 text-slate-950'
                : 'bg-slate-900/60 border-slate-700/60 text-white hover:bg-slate-800/80'
            }`}
            title="Шамшырақ / Фонарик"
          >
            {isTorchOn ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
          </button>
        )}

        {/* Switch camera (front/rear) */}
        {!staticImageUrl && (
          <button
            onClick={switchCameraFacing}
            className="p-2.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-white hover:bg-slate-800/80 backdrop-blur-md transition cursor-pointer"
            title="Камераны ауыстыру / Сменить камеру"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Camera Error / No-Camera Fallback Overlay */}
      {cameraError && !staticImageUrl && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-lg text-center animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center mb-4 text-red-400">
            <AlertCircle className="w-7 h-7" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {language === 'kz'
              ? 'Камераны іске қосу мүмкін болмады'
              : 'Не удалось подключиться к камере'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            {cameraError}
            <br />
            {language === 'kz'
              ? 'Браузер баптауынан камераға рұқсат беріңіз немесе үлгі суреттерді пайдаланыңыз.'
              : 'Разрешите доступ к камере в браузере или протестируйте с помощью готовых фото.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startCamera}
              disabled={isStartingCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className={`w-4 h-4 ${isStartingCamera ? 'animate-spin' : ''}`} />
              <span>{language === 'kz' ? 'Қайта қосу' : 'Повторить'}</span>
            </button>

            <button
              onClick={onOpenSampleModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{language === 'kz' ? 'Үлгі суреттер' : 'Примеры объектов'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition cursor-pointer"
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
