import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { ChordPalette } from './ChordPalette';
import { chordLibrary } from '../utils/chordShapes';
import { Song } from '../types';

const majorChords = Object.keys(chordLibrary).filter(
  (c) => !c.includes('m') && !c.includes('7') && !c.includes('#') && !c.includes('b')
);

interface SongFormProps {
  initialData?: Song;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  buttonText: string;
  title: string;
}

export const SongForm: React.FC<SongFormProps> = ({
  initialData = {
    title: '',
    artist: '',
    lyrics: '',
    key: 'C',
    difficulty: 'MEDIUM',
  } as unknown as Song,
  onSubmit,
  isLoading,
  buttonText,
  title,
}) => {
  const [form, setForm] = useState<Song>(initialData);

  const updateField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const insertChord = (chord: string) => {
    const textarea = document.getElementById('lyrics') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newLyrics = form.lyrics.substring(0, start) + `[${chord}]` + form.lyrics.substring(end);
    setForm({ ...form, lyrics: newLyrics });
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + chord.length + 2;
      textarea.focus();
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название песни *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={updateField('title')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            placeholder="Hotel California"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Исполнитель *</label>
          <input
            type="text"
            required
            value={form.artist}
            onChange={updateField('artist')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            placeholder="Eagles"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Тональность</label>
            <select
              value={form.key}
              onChange={updateField('key')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              {majorChords.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Сложность</label>
            <select
              value={form.difficulty}
              onChange={updateField('difficulty')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="BEGINNER">Начинающий</option>
              <option value="MEDIUM">Средний</option>
              <option value="ADVANCED">Продвинутый</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Аккорды (нажмите для вставки)</label>
          <ChordPalette onSelectChord={insertChord} />

          <label className="block text-sm font-medium mt-4 mb-1">Текст с аккордами *</label>
          <textarea
            id="lyrics"
            required
            rows={12}
            value={form.lyrics}
            onChange={updateField('lyrics')}
            className="w-full px-3 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            placeholder="Пример: [C]Текст песни с аккордами [Am]в квадратных скобках"
          />
          <p className="text-xs text-gray-500 mt-1">Формат: [Аккорд]текст песни</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        <Save size={20} />
        {isLoading ? 'Сохранение...' : buttonText}
      </button>
    </form>
  );
};
