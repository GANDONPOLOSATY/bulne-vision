import { ITEM_DICTIONARY, type ItemKnowledge, lookupItem } from '../data/translations';
import type { SupportedLanguage } from './speechService';

// Objects that are commonly found in a room / office / home
export const GAME_TARGET_IDS = [
  'cup',
  'bottle',
  'book',
  'cell_phone',
  'laptop',
  'chair',
  'mouse',
  'keyboard',
  'apple',
  'banana',
  'backpack',
  'scissors',
  'remote',
  'clock',
  'potted_plant',
  'person'
];

export interface Quest {
  targetId: string;
  item: ItemKnowledge;
  points: number;
}

export function getRandomQuest(excludeId?: string): Quest {
  const available = GAME_TARGET_IDS.filter(id => id !== excludeId);
  const randomId = available[Math.floor(Math.random() * available.length)];
  const item = lookupItem(randomId) || ITEM_DICTIONARY[randomId];
  return {
    targetId: randomId,
    item,
    points: 100
  };
}

export function getQuestPrompt(quest: Quest, lang: SupportedLanguage): { title: string; spoken: string } {
  const name = lang === 'kz' ? quest.item.kz : lang === 'ru' ? quest.item.ru : quest.item.en;
  
  if (lang === 'kz') {
    return {
      title: `Мына затты тап: ${name}`,
      spoken: `Мына затты тап: ${name}!`
    };
  } else if (lang === 'ru') {
    return {
      title: `Найди предмет: ${name}`,
      spoken: `Найди предмет: ${name}!`
    };
  } else {
    return {
      title: `Find this object: ${name}`,
      spoken: `Find the object: ${name}!`
    };
  }
}

export function getSuccessMessage(quest: Quest, lang: SupportedLanguage): string {
  const name = lang === 'kz' ? quest.item.kz : lang === 'ru' ? quest.item.ru : quest.item.en;
  if (lang === 'kz') {
    return `Керемет! Дәл таптың, бұл — ${name}!`;
  } else if (lang === 'ru') {
    return `Отлично! Точно в цель: это — ${name}!`;
  } else {
    return `Great job! You found the ${name}!`;
  }
}
