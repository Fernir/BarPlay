import React, { useState } from 'react';
import { chordLibrary } from '../utils/chordShapes';

interface ChordPaletteProps {
  onSelectChord: (chord: string) => void;
}

// Группируем аккорды по типу
const getChordCategories = () => {
  const chords = Object.keys(chordLibrary);

  const categories = {
    Мажорные: chords.filter(
      (c) => !c.includes('m') && !c.includes('7') && !c.includes('#') && !c.includes('b')
    ),
    Минорные: chords.filter((c) => c.includes('m') && !c.includes('7')),
    Септаккорды: chords.filter((c) => c.includes('7') && !c.includes('m')),
    'Минорные септ': chords.filter((c) => c.includes('m7')),
    Диезы: chords.filter((c) => c.includes('#')),
    Бемоли: chords.filter((c) => c.includes('b')),
  };

  return categories;
};

export const ChordPalette: React.FC<ChordPaletteProps> = ({ onSelectChord }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Мажорные');
  const categories = getChordCategories();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors">
      {/* Категории */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={(e) => {
              e.preventDefault();
              setActiveCategory(category);
            }}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Список аккордов */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
        {categories[activeCategory as keyof typeof categories].map((chord) => (
          <button
            key={chord}
            onClick={(e) => {
              e.preventDefault();
              onSelectChord(chord);
            }}
            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 
                       border border-gray-200 dark:border-gray-600 rounded-md text-sm font-mono 
                       text-gray-700 dark:text-gray-300 transition-colors"
            title={`Аккорд ${chord}`}
          >
            {chord}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
        Нажмите на аккорд, чтобы вставить его в текст
      </p>
    </div>
  );
};
