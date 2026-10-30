import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, ShieldCheck, History, Sparkles, Gamepad2, Scan } from 'lucide-react';
import type { SupportedLanguage } from '../utils/speechService';
import { triggerHaptic } from '../utils/haptics';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  isGameMode: boolean;
  setIsGameMode: (game: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  isMuted,
  setIsMuted,
  onOpenSettings,
  onOpenHistory,
  historyCount,
  isGameMode,
  setIsGameMode,
}) => {
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const securityInfo = {
    kz: '100% Қауіпсіз: камера деректері құрылғыңыздан ешқайда жіберілмейді (WebGL).',
    ru: '100% Безопасно: видео обрабатывается локально на вашем устройстве внутри браузера.',
    en: '100% Private: camera frames are processed on-device locally via WebGL.',
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 py-2.5 sm:px-6 flex items-center justify-between bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent backdrop-blur-md">
      {/* Brand & Mode switch */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-amber-400 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <span className="font-mono font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
            BulNe?
          </span>
        </div>

        {/* Mode Toggle Pill */}
        <div className="flex items-center p-0.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-lg">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsGameMode(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              !isGameMode
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'kz' ? 'Сканер' : 'Сканер'}
            </span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              setIsGameMode(true);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isGameMode
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-amber-300'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{language === 'kz' ? 'Тапқыр' : 'Игра'}</span>
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Language segmented selector */}
        <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          {(['kz', 'ru', 'en'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                triggerHaptic('light');
                setLanguage(lang);
              }}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold uppercase rounded-md transition-all cursor-pointer ${
                language === lang
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Security badge */}
        <button
          onClick={() => setShowSecurityTooltip(!showSecurityTooltip)}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-emerald-400 hover:bg-slate-800 transition cursor-pointer"
          title="Privacy"
        >
          <ShieldCheck className="w-4 h-4" />
        </button>

        {showSecurityTooltip && (
          <div className="absolute right-4 top-14 w-64 p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl text-xs text-slate-300 z-50">
            <p>{securityInfo[language]}</p>
          </div>
        )}

        {/* Mute button */}
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsMuted(!isMuted);
          }}
          className={`p-2 rounded-lg border transition cursor-pointer ${
            isMuted
              ? 'bg-red-950/50 border-red-800 text-red-400'
              : 'bg-slate-900/80 border-slate-800 text-cyan-400'
          }`}
          title="Звук"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* History */}
        {!isGameMode && (
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenHistory();
            }}
            className="relative p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Тарих / История"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-cyan-400 text-slate-950 font-black text-[9px] rounded-full min-w-3.5 text-center">
                {historyCount}
              </span>
            )}
          </button>
        )}

        {/* Settings */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenSettings();
          }}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          title="Баптаулар / Настройки"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
