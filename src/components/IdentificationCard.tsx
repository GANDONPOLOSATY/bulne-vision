import React, { useState } from 'react';
import { Volume2, Sparkles, Check, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import type { DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';
import { triggerHaptic } from '../utils/haptics';

interface IdentificationCardProps {
  detection: DetectionResult | null;
  language: SupportedLanguage;
  onReplaySpeech: () => void;
  isSpeaking: boolean;
}

export const IdentificationCard: React.FC<IdentificationCardProps> = ({
  detection,
  language,
  onReplaySpeech,
  isSpeaking,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!detection) {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>
              {language === 'kz'
                ? 'Камераны затқа бағыттаңыз...'
                : language === 'ru'
                ? 'Наведите камеру на любой объект...'
                : 'Point camera at any object...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const { knowledge, score } = detection;
  const scorePercent = Math.round(score * 100);

  const title =
    language === 'kz'
      ? knowledge.kz
      : language === 'ru'
      ? knowledge.ru
      : knowledge.en;

  const phrase =
    language === 'kz'
      ? knowledge.spokenKz
      : language === 'ru'
      ? knowledge.spokenRu
      : knowledge.spokenEn;

  const secondaryTitle = language === 'kz' ? knowledge.ru : knowledge.kz;
  const secondaryLang = language === 'kz' ? 'RU' : 'KZ';

  const fact = language === 'kz' ? knowledge.factKz : knowledge.factRu;

  const handleCopy = () => {
    triggerHaptic('light');
    navigator.clipboard.writeText(`${phrase}. ${fact}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl transition-all">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                {knowledge.category}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {scorePercent}%
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate mt-0.5">
              {title}
            </h2>

            <p className="text-xs text-cyan-300/80 font-medium truncate">
              {secondaryLang}: {secondaryTitle}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('medium');
                onReplaySpeech();
              }}
              className={`p-3 rounded-xl font-bold transition cursor-pointer shadow-lg active:scale-90 ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 shadow-amber-400/30 animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
              }`}
              title="Дауыстап айту / Озвучить"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer active:scale-90"
              title="Толығырақ / Подробнее"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Fact & Copy Card */}
        {isExpanded && fact && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-amber-300 mb-1">
                {language === 'kz' ? '💡 Қызықты дерек:' : '💡 Интересный факт:'}
              </p>
              <p>{fact}</p>
            </div>

            <div className="mt-2.5 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Көшірілді / Скопировано' : 'Көшіру / Копировать'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
