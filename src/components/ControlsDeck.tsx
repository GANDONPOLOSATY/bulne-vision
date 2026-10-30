import React from 'react';
import { Scan, Radio, Image as ImageIcon, Upload, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../utils/speechService';

interface ControlsDeckProps {
  onScanNow: () => void;
  isAutoScan: boolean;
  setIsAutoScan: (auto: boolean) => void;
  onOpenSampleModal: () => void;
  onTriggerFileUpload: () => void;
  language: SupportedLanguage;
  isDetecting: boolean;
}

export const ControlsDeck: React.FC<ControlsDeckProps> = ({
  onScanNow,
  isAutoScan,
  setIsAutoScan,
  onOpenSampleModal,
  onTriggerFileUpload,
  language,
  isDetecting,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 mb-8 px-4 flex flex-col items-center gap-4">
      <div className="w-full p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Auto-Scan Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoScan(!isAutoScan)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              isAutoScan
                ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 shadow-md shadow-cyan-900/30'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className={`w-4 h-4 ${isAutoScan ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span>
              {language === 'kz'
                ? isAutoScan ? 'Авто-скан: Қосулы' : 'Авто-скан: Өшірулі'
                : isAutoScan ? 'Авто-скан: Вкл' : 'Авто-скан: Выкл'}
            </span>
          </button>
        </div>

        {/* Center: Hero Shutter Scan Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onScanNow}
            disabled={isDetecting}
            className="group relative flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 font-black text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
          >
            {/* Pulsing ring aura */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-amber-400 opacity-40 blur-md group-hover:opacity-75 transition" />

            <div className="relative flex items-center gap-2">
              <Scan className={`w-5 h-5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{language === 'kz' ? 'Бұл не? Сканерлеу' : 'Что это? Сканировать'}</span>
              <Sparkles className="w-4 h-4 text-amber-900" />
            </div>
          </button>
        </div>

        {/* Right: Samples & Upload Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleModal}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Үлгі суреттер / Примеры объектов"
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">
              {language === 'kz' ? 'Үлгілер' : 'Примеры'}
            </span>
          </button>

          <button
            onClick={onTriggerFileUpload}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Фото жүктеу / Загрузить фото"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'kz' ? 'Жүктеу' : 'Загрузить'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
