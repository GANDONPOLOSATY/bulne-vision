import React, { useState } from 'react';
import { Volume2, Sparkles, Check, Copy, Info, Tag } from 'lucide-react';
import type { DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';

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

  if (!detection) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-center transition-all">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>
            {language === 'kz'
              ? 'Камераны кез келген затқа бағыттаңыз немесе «Бұл не?» батырмасын басыңыз...'
              : language === 'ru'
              ? 'Наведите камеру на любой предмет или нажмите кнопку «Что это?»...'
              : 'Point camera at any object or tap the scan button...'}
          </span>
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

  const fact = language === 'kz' ? knowledge.factKz : knowledge.factRu;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${phrase}. ${fact}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 shadow-xl shadow-cyan-950/30 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        {/* Main Identification Label */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-700/60 text-cyan-400 shadow-inner">
            <Tag className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
                {knowledge.category}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {scorePercent}% дәлдік
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-cyan-300/90 font-medium mt-0.5">
              «{phrase}»
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onReplaySpeech}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/25 animate-pulse'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-400/40'
            }`}
            title="Дауыстап айту / Озвучить"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'kz' ? 'Айту' : 'Озвучить'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Көшіріп алу / Скопировать"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Educational Fact / Knowledge Snippet */}
      {fact && (
        <div className="mt-3.5 flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs sm:text-sm text-slate-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-amber-300/90 mr-1">
              {language === 'kz' ? 'Қызықты дерек:' : 'Интересный факт:'}
            </span>
            {fact}
          </p>
        </div>
      )}
    </div>
  );
};
