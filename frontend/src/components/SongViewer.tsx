import React from 'react';
import { ChordTooltip } from './ChordTooltip';

interface SongViewerProps {
  lyrics: string;
}

export const SongViewer: React.FC<SongViewerProps> = ({ lyrics }) => {
  const lines = lyrics.split('\n');

  return (
    <div className="song-viewer">
      {lines.map((line, lineIndex) => {
        // Находим все аккорды в строке
        const chords: { chord: string; index: number }[] = [];
        let cleanText = line;
        let match;
        const chordRegex = /\[([^\]]+)\]/g;

        while ((match = chordRegex.exec(line)) !== null) {
          chords.push({
            chord: match[1],
            index: match.index,
          });
          cleanText = cleanText.replace(match[0], '');
        }

        if (chords.length === 0) {
          return (
            <div key={lineIndex} className="mb-4">
              <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {line}
              </div>
            </div>
          );
        }

        // Создаем строку аккордов (расставляем пробелы)
        let chordLine = '';
        let lastPos = 0;

        for (const chord of chords) {
          const spaces = chord.index - lastPos;
          chordLine += ' '.repeat(spaces);
          chordLine += chord.chord;
          lastPos = chord.index + chord.chord.length;
        }

        return (
          <div key={lineIndex} className="mb-4">
            {/* Строка с аккордами - убираем text-sm, размер наследуется */}
            <div className="font-mono whitespace-pre-wrap mb-1 break-words text-inherit">
              {chordLine.split('').map((char, i) => {
                if (char === ' ') {
                  return (
                    <span key={i} className="opacity-0 select-none">
                      .
                    </span>
                  );
                }
                let currentChord = '';
                for (const chord of chords) {
                  if (chord.index <= i && i < chord.index + chord.chord.length) {
                    currentChord = chord.chord;
                    break;
                  }
                }
                if (currentChord && i === chords.find((c) => c.chord === currentChord)?.index) {
                  return (
                    <ChordTooltip key={i} chord={currentChord}>
                      <span className="inline-block font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-0.5 rounded">
                        {currentChord}
                      </span>
                    </ChordTooltip>
                  );
                }
                return null;
              })}
            </div>
            {/* Строка с текстом - убираем text-base, размер наследуется */}
            <div className="font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words text-inherit">
              {cleanText}
            </div>
          </div>
        );
      })}
    </div>
  );
};
