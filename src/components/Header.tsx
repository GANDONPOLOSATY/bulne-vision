import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, ShieldCheck, History, Sparkles, HelpCircle } from 'lucide-react';
import type { SupportedLanguage } from '../utils/speechService';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  isMuted,
  setIsMuted,
  onOpenSettings,
  onOpenHistory,
  historyCount,
}) => {
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const titles = {
    kz: { name: 'БұлНе?', subtitle: 'Көріп, танып, айтады', secure: '100% Қауіпсіз' },
    ru: { name: 'BulNe?', subtitle: 'Видит, распознает и говорит', secure: '100% Безопасно' },
    en: { name: 'BulNe?', subtitle: 'Scans, identifies & speaks', secure: '100% Private' },
  };

  const securityInfo = {
    kz: 'Бейне ағыны құрылғыңыздан ешқайда жіберілмейді. Барлық есептеулер жергілікті түрде (браузердің ішінде WebGL арқылы) өңделеді.',
    ru: 'Видеопоток с камеры не отправляется на сторонние серверы. Вся обработка происходит локально на вашем устройстве внутри браузера.',
    en: 'Camera feed stays on your device. All object detection neural network inferences run 100% locally in your browser via WebGL.',
  };

  return (
    <header className="relative z-30 w-full px-4 py-3 sm:px-6 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between transition-all">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-amber-400 p-0.5 shadow-lg shadow-cyan-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1 font-mono">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                BulNe?
              </span>
            </h1>
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
              AI Vision
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
            {titles[language].subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Security indicator */}
        <div className="relative">
          <button
            onClick={() => setShowSecurityTooltip(!showSecurityTooltip)}
            onMouseEnter={() => setShowSecurityTooltip(true)}
            onMouseLeave={() => setShowSecurityTooltip(false)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/40 text-xs font-medium transition cursor-pointer"
            title="Privacy & Security"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">{titles[language].secure}</span>
            <HelpCircle className="w-3 h-3 text-emerald-500/70 hidden sm:inline" />
          </button>

          {showSecurityTooltip && (
            <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-300 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{titles[language].secure}</span>
              </div>
              <p className="leading-relaxed">{securityInfo[language]}</p>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          {(['kz', 'ru', 'en'] as SupportedLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 text-xs font-semibold uppercase rounded-md transition-all cursor-pointer ${
                language === lang
                  ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Mute button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-lg border transition cursor-pointer ${
            isMuted
              ? 'bg-red-950/40 border-red-800/60 text-red-400 hover:bg-red-900/40'
              : 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800'
          }`}
          title={isMuted ? 'Дауысты қосу / Включить звук' : 'Дауысты өшіру / Выключить звук'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* History button */}
        <button
          onClick={onOpenHistory}
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Тарих / История сканирований"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-bold text-[10px] rounded-full min-w-4 text-center">
              {historyCount}
            </span>
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Баптаулар / Настройки"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
