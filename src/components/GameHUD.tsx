import React from 'react';
import { Trophy, Volume2, SkipForward, Flame } from 'lucide-react';
import type { Quest } from '../utils/gameService';
import type { SupportedLanguage } from '../utils/speechService';

export const GameHUD: React.FC<{
  quest: Quest | null;
  score: number;
  streak: number;
  onSkipQuest: () => void;
  onPlayQuestPrompt: () => void;
  language: SupportedLanguage;
  isWon: boolean;
}> = ({
  quest,
  score,
  streak,
  onSkipQuest,
  onPlayQuestPrompt,
  language,
  isWon,
}) => {
  if (!quest) return null;

  const targetName =
    language === 'kz'
      ? quest.item.kz
      : language === 'ru'
      ? quest.item.ru
      : quest.item.en;

  return (
    <div className="absolute top-16 left-4 right-4 z-20 max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      <div
        className={`p-3.5 sm:p-4 rounded-2xl backdrop-blur-2xl border transition-all shadow-2xl ${
          isWon
            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-emerald-500/30 scale-105'
            : 'bg-slate-950/85 border-amber-500/40 text-slate-100 shadow-amber-950/30'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold pb-2 border-b border-slate-800/80 mb-2.5">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="w-4 h-4 fill-amber-400" />
            <span className="font-mono text-sm">{score}</span>
            <span className="text-[11px] text-amber-500/80 uppercase">
              {language === 'kz' ? 'ұпай' : 'очков'}
            </span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/60 text-orange-400 font-mono text-xs animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>x{streak} Streak</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-[11px] font-medium text-amber-300/90 uppercase tracking-wider">
              {isWon
                ? language === 'kz' ? '🎉 Дұрыс таптың!' : '🎉 Точно в цель!'
                : language === 'kz' ? 'Тапсырма: Затты тап' : 'Задание: Найди предмет'}
            </p>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
              {targetName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPlayQuestPrompt}
              className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 transition active:scale-90 cursor-pointer"
              title="Тапсырманы тыңдау / Прослушать задание"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={onSkipQuest}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition active:scale-90 cursor-pointer"
              title="Басқа зат / Другой предмет"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
