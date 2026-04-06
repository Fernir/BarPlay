export interface ChordPosition {
  string: number; // 6 (толстая, сверху) - 1 (тонкая, снизу)
  fret: number; // 0 - открытая, 1-24 - лад
}

export interface ChordShape {
  name: string;
  positions: ChordPosition[]; // Зажатые лады
  barre?: number; // Баррэ на ладу
  muted?: number[]; // Струны которые не играют (X)
  open?: number[]; // Открытые струны (O)
}

export const chordLibrary: Record<string, ChordShape> = {
  // Основные аккорды (мажорные)
  C: {
    name: 'C',
    positions: [
      { string: 5, fret: 3 },
      { string: 4, fret: 2 },
      { string: 2, fret: 1 },
    ],
    muted: [6],
    open: [1, 3],
  },

  'C#': {
    name: 'C#',
    barre: 4,
    positions: [
      { string: 2, fret: 6 },
      { string: 3, fret: 6 },
      { string: 4, fret: 6 },
    ],
    muted: [5, 6],
    open: [1],
  },

  D: {
    name: 'D',
    positions: [
      { string: 4, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 2 },
    ],
    muted: [5, 6],
    open: [],
  },

  'D#': {
    name: 'D#',
    barre: 6,
    positions: [
      { string: 2, fret: 8 },
      { string: 3, fret: 8 },
      { string: 4, fret: 8 },
    ],
    muted: [5, 6],
    open: [1],
  },

  E: {
    name: 'E',
    positions: [
      { string: 6, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: 2 },
      { string: 3, fret: 1 },
    ],
    muted: [],
    open: [1, 2],
  },

  F: {
    name: 'F',
    barre: 1,
    positions: [
      { string: 4, fret: 3 },
      { string: 3, fret: 2 },
      { string: 2, fret: 1 },
    ],
    muted: [5, 6],
    open: [1],
  },

  'F#': {
    name: 'F#',
    barre: 2,
    positions: [
      { string: 4, fret: 4 },
      { string: 3, fret: 3 },
      { string: 2, fret: 2 },
    ],
    muted: [5, 6],
    open: [1],
  },

  G: {
    name: 'G',
    positions: [
      { string: 6, fret: 3 },
      { string: 5, fret: 2 },
      { string: 1, fret: 3 },
      { string: 2, fret: 3 },
    ],
    muted: [],
    open: [3, 4],
  },

  'G#': {
    name: 'G#',
    barre: 4,
    positions: [
      { string: 5, fret: 6 },
      { string: 4, fret: 6 },
      { string: 3, fret: 5 },
    ],
    muted: [6],
    open: [1, 2],
  },

  A: {
    name: 'A',
    positions: [
      { string: 5, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: 2 },
      { string: 2, fret: 2 },
    ],
    muted: [6],
    open: [1],
  },

  'A#': {
    name: 'A#',
    barre: 1,
    positions: [
      { string: 5, fret: 1 },
      { string: 4, fret: 3 },
      { string: 3, fret: 3 },
      { string: 2, fret: 3 },
    ],
    muted: [6],
    open: [1],
  },

  B: {
    name: 'B',
    barre: 2,
    positions: [
      { string: 5, fret: 2 },
      { string: 4, fret: 4 },
      { string: 3, fret: 4 },
      { string: 2, fret: 4 },
    ],
    muted: [6],
    open: [1],
  },

  // Минорные аккорды
  Cm: {
    name: 'Cm',
    barre: 3,
    positions: [
      { string: 5, fret: 3 },
      { string: 4, fret: 5 },
      { string: 3, fret: 5 },
      { string: 2, fret: 4 },
    ],
    muted: [6],
    open: [1],
  },

  Dm: {
    name: 'Dm',
    positions: [
      { string: 4, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 1 },
    ],
    muted: [5, 6],
    open: [],
  },

  Em: {
    name: 'Em',
    positions: [
      { string: 5, fret: 2 },
      { string: 4, fret: 2 },
    ],
    muted: [],
    open: [1, 2, 3, 6],
  },

  Fm: {
    name: 'Fm',
    barre: 1,
    positions: [
      { string: 4, fret: 3 },
      { string: 3, fret: 3 },
      { string: 2, fret: 1 },
    ],
    muted: [5, 6],
    open: [1],
  },

  Gm: {
    name: 'Gm',
    barre: 3,
    positions: [
      { string: 5, fret: 3 },
      { string: 4, fret: 5 },
      { string: 3, fret: 5 },
      { string: 2, fret: 3 },
    ],
    muted: [6],
    open: [1],
  },

  Am: {
    name: 'Am',
    positions: [
      { string: 4, fret: 2 },
      { string: 3, fret: 2 },
      { string: 2, fret: 1 },
    ],
    muted: [6],
    open: [1, 5],
  },

  Bm: {
    name: 'Bm',
    barre: 2,
    positions: [
      { string: 5, fret: 2 },
      { string: 4, fret: 4 },
      { string: 3, fret: 4 },
      { string: 2, fret: 3 },
    ],
    muted: [6],
    open: [1],
  },

  // Септаккорды (7)
  C7: {
    name: 'C7',
    positions: [
      { string: 5, fret: 3 },
      { string: 4, fret: 2 },
      { string: 2, fret: 3 },
      { string: 1, fret: 1 },
    ],
    muted: [6],
    open: [3],
  },

  D7: {
    name: 'D7',
    positions: [
      { string: 4, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 1 },
      { string: 1, fret: 2 },
    ],
    muted: [5, 6],
    open: [],
  },

  E7: {
    name: 'E7',
    positions: [
      { string: 6, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: 0 },
      { string: 3, fret: 1 },
      { string: 2, fret: 0 },
      { string: 1, fret: 0 },
    ],
    muted: [],
    open: [],
  },

  G7: {
    name: 'G7',
    positions: [
      { string: 6, fret: 3 },
      { string: 5, fret: 2 },
      { string: 4, fret: 0 },
      { string: 3, fret: 0 },
      { string: 1, fret: 1 },
    ],
    muted: [],
    open: [2],
  },

  A7: {
    name: 'A7',
    positions: [
      { string: 5, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: 0 },
      { string: 2, fret: 2 },
    ],
    muted: [6],
    open: [1],
  },

  B7: {
    name: 'B7',
    positions: [
      { string: 5, fret: 2 },
      { string: 4, fret: 1 },
      { string: 3, fret: 2 },
      { string: 2, fret: 0 },
      { string: 1, fret: 2 },
    ],
    muted: [6],
    open: [],
  },

  // Добавим несколько популярных минорных септаккордов
  Am7: {
    name: 'Am7',
    positions: [
      { string: 5, fret: 0 },
      { string: 4, fret: 2 },
      { string: 3, fret: 0 },
      { string: 2, fret: 1 },
    ],
    muted: [6],
    open: [1],
  },

  Dm7: {
    name: 'Dm7',
    positions: [
      { string: 4, fret: 0 },
      { string: 3, fret: 2 },
      { string: 2, fret: 1 },
      { string: 1, fret: 1 },
    ],
    muted: [5, 6],
    open: [],
  },

  Em7: {
    name: 'Em7',
    positions: [
      { string: 6, fret: 0 },
      { string: 5, fret: 2 },
      { string: 4, fret: 0 },
      { string: 3, fret: 0 },
      { string: 2, fret: 0 },
      { string: 1, fret: 0 },
    ],
    muted: [],
    open: [],
  },
};

// Функция для парсинга имени аккорда (убирает тональность)
export const parseChordName = (chord: string): string => {
  // Убираем басы (G/B -> G)
  const baseChord = chord.split('/')[0];

  // Нормализуем название
  let normalized = baseChord.replace('♯', '#').replace('♭', 'b').trim();

  // Убираем цифры (C5, C6 и т.д.)
  normalized = normalized.replace(/[0-9]/g, '');

  return normalized;
};

// Функция для получения аппликатуры аккорда
export const getChordShape = (chordName: string): ChordShape | null => {
  const parsed = parseChordName(chordName);
  return chordLibrary[parsed] || null;
};
