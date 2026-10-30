import React from 'react';
import { Scan, Radio, Image as ImageIcon, Upload } from 'lucide-react';
import type { SupportedLanguage } from '../utils/speechService';
import { triggerHaptic } from '../utils/haptics';

interface ControlsDeckProps {
  onScanNow: () => void;
  isAutoScan: boolean;
  setIsAutoScan: (auto: boolean) => void;
  onOpenSampleModal: () => void;
  onTriggerFileUpload: () => void;
  language: SupportedLanguage;
  isDetecting: boolean;
  isGameMode?: boolean;
}

export const ControlsDeck: React.FC<ControlsDeckProps> = ({
  onScanNow,
  isAutoScan,
  setIsAutoScan,
  onOpenSampleModal,
  onTriggerFileUpload,
  language,
  isDetecting,
  isGameMode = false,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2 flex items-center justify-between gap-2.5">
      {/* Auto-Scan or Sample items */}
      {!isGameMode ? (
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsAutoScan(!isAutoScan);
          }}
          className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border transition active:scale-90 cursor-pointer ${
            isAutoScan
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/50'
              : 'bg-slate-900/80 border-slate-700/80 text-slate-400'
          }`}
          title="Авто-скан"
        >
          <Radio className={`w-4 h-4 sm:w-5 sm:h-5 ${isAutoScan ? 'text-cyan-400 animate-pulse' : ''}`} />
          <span className="text-[10px] font-bold mt-0.5">Авто</span>
        </button>
      ) : (
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSampleModal();
          }}
          className="flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 active:scale-90 transition cursor-pointer"
          title="Үлгілер / Примеры"
        >
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="text-[10px] font-bold mt-0.5">Үлгі</span>
        </button>
      )}

      {/* Main Tactile Shutter Button */}
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => {
            triggerHaptic('success');
            onScanNow();
          }}
          disabled={isDetecting}
          className={`relative group flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full border-4 transition-all duration-200 cursor-pointer active:scale-90 shadow-2xl ${
            isGameMode
              ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 border-amber-200/80 shadow-amber-500/40'
              : 'bg-gradient-to-tr from-cyan-500 via-sky-400 to-emerald-400 border-cyan-200/80 shadow-cyan-500/40'
          }`}
          title={language === 'kz' ? 'Сканерлеу' : 'Сканировать'}
        >
          <span className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-md group-hover:bg-cyan-400/50 transition" />
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950/90 flex items-center justify-center">
            <Scan
              className={`w-6 h-6 sm:w-7 sm:h-7 ${isGameMode ? 'text-amber-400' : 'text-cyan-300'} ${
                isDetecting ? 'animate-spin' : ''
              }`}
            />
          </div>
        </button>
      </div>

      {/* Upload & Sample Gallery buttons */}
      <div className="flex items-center gap-2">
        {!isGameMode && (
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenSampleModal();
            }}
            className="flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 active:scale-90 transition cursor-pointer"
            title="Үлгілер / Примеры"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-[10px] font-bold mt-0.5">Үлгі</span>
          </button>
        )}

        <button
          onClick={() => {
            triggerHaptic('light');
            onTriggerFileUpload();
          }}
          className="flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 active:scale-90 transition cursor-pointer"
          title="Фото жүктеу / Загрузить фото"
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="text-[10px] font-bold mt-0.5">
            {language === 'kz' ? 'Фото' : 'Фото'}
          </span>
        </button>
      </div>
    </div>
  );
};
