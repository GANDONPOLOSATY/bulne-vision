import React, { useState } from 'react';
import { Volume2, Sparkles, Check, Copy, ChevronUp, ChevronDown, Share2, Snail } from 'lucide-react';
import type { DetectionResult } from '../utils/detectorService';
import type { SupportedLanguage } from '../utils/speechService';
import { triggerHaptic } from '../utils/haptics';

interface IdentificationCardProps {
  detection: DetectionResult | null;
  allDetections?: DetectionResult[];
  onSelectDetection?: (det: DetectionResult) => void;
  language: SupportedLanguage;
  onReplaySpeech: (rate?: number) => void;
  isSpeaking: boolean;
}

export const IdentificationCard: React.FC<IdentificationCardProps> = ({
  detection,
  allDetections = [],
  onSelectDetection,
  language,
  onReplaySpeech,
  isSpeaking,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!detection) {
    return (
      <div className="w-full max-w-lg mx-auto px-3">
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

  const handleShare = async () => {
    triggerHaptic('light');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `BulNe? — ${title}`,
          text: `${phrase}. ${fact}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-3 space-y-2">
      {/* Detected Objects Chips Bar (when 2 or more objects are visible) */}
      {allDetections.length > 1 && onSelectDetection && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pl-1 shrink-0">
            {language === 'kz' ? 'Нысандар:' : 'Найдено:'}
          </span>
          {allDetections.map((d, i) => {
            const isCurrent =
              d.class === detection.class &&
              Math.abs(d.bbox[0] - detection.bbox[0]) < 10 &&
              Math.abs(d.bbox[1] - detection.bbox[1]) < 10;
            const chipName =
              language === 'kz'
                ? d.knowledge.kz
                : language === 'ru'
                ? d.knowledge.ru
                : d.knowledge.en;

            return (
              <button
                key={`${d.class}_${i}`}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectDetection(d);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 active:scale-95'
                }`}
              >
                <span>{chipName}</span>
                <span className={`text-[10px] ${isCurrent ? 'text-slate-900 font-black' : 'text-slate-500'}`}>
                  {Math.round(d.score * 100)}%
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Identification Card */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl transition-all">
        {/* Main Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wide">
                {knowledge.category}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
          <div className="flex items-center gap-1.5">
            {/* Standard Speech */}
            <button
              onClick={() => {
                triggerHaptic('medium');
                onReplaySpeech(1.0);
              }}
              className={`p-2.5 sm:p-3 rounded-xl font-bold transition cursor-pointer shadow-lg active:scale-90 ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 shadow-amber-400/30 animate-pulse'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
              }`}
              title={language === 'kz' ? 'Дауыстап айту' : 'Озвучить'}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            {/* Slow Speech for pronunciation learning */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onReplaySpeech(0.72);
              }}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-300 hover:text-white transition cursor-pointer active:scale-90 flex items-center justify-center"
              title={language === 'kz' ? 'Баяу дауыстау (үйрену)' : 'Медленное произношение'}
            >
              <Snail className="w-5 h-5" />
            </button>

            {/* Expand / Details Toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white transition cursor-pointer active:scale-90"
              title={language === 'kz' ? 'Толығырақ' : 'Подробнее'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Fact & Share Card */}
        {isExpanded && fact && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'kz' ? 'Қызықты дерек:' : 'Интересный факт:'}</span>
              </p>
              <p>{fact}</p>
            </div>

            <div className="mt-2.5 flex items-center justify-end gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'kz' ? 'Бөлісу' : 'Поделиться'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Көшірілді' : 'Көшіру'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
