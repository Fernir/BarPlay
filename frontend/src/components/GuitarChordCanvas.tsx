import React, { useRef, useEffect } from 'react';
import { getChordShape } from '../utils/chordShapes';

interface GuitarChordCanvasProps {
  chordName: string;
  width?: number;
  height?: number;
}

export const GuitarChordCanvas: React.FC<GuitarChordCanvasProps> = ({
  chordName,
  width = 200,
  height = 250,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const startX = 40;
    const startY = 40;
    const stringSpacing = (width - 80) / 5;
    const fretSpacing = (height - 80) / 4;

    // Рисуем струны (6 - толстая сверху, 1 - тонкая снизу)
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const x = startX + i * stringSpacing;
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + fretSpacing * 4);
      ctx.stroke();
    }

    // Рисуем лады
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const y = startY + i * fretSpacing;
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + 5 * stringSpacing, y);
      ctx.lineWidth = i === 0 ? 3 : 1.5;
      ctx.stroke();
    }

    // Номера ладов
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    for (let i = 1; i <= 4; i++) {
      ctx.fillText(i.toString(), startX - 20, startY + i * fretSpacing - 5);
    }

    // Получаем аккорд из библиотеки
    const chord = getChordShape(chordName);

    if (!chord) {
      ctx.fillStyle = '#999';
      ctx.font = '14px Arial';
      ctx.fillText(`Нет данных для ${chordName}`, startX, startY + 100);
      return;
    }

    // Рисуем баррэ
    if (chord.barre) {
      const fret = chord.barre;
      const y = startY + (fret - 1) * fretSpacing + fretSpacing / 2;
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3b82f6';
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + 5 * stringSpacing, y);
      ctx.stroke();
    }

    // Рисуем зажатые лады (пальцы)
    chord.positions.forEach((pos) => {
      const stringIndex = 6 - pos.string; // Преобразуем для отрисовки (6->0, 1->5)
      const x = startX + stringIndex * stringSpacing;
      const y = startY + (pos.fret - 1) * fretSpacing + fretSpacing / 2;

      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('●', x - 4, y + 5);
    });

    // Рисуем открытые струны (○)
    if (chord.open && chord.open.length > 0) {
      chord.open.forEach((stringNum) => {
        const stringIndex = 6 - stringNum;
        const x = startX + stringIndex * stringSpacing;
        const y = startY - 12;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('○', x - 4, y + 4);
      });
    }

    // Рисуем заглушенные струны (×)
    if (chord.muted && chord.muted.length > 0) {
      chord.muted.forEach((stringNum) => {
        const stringIndex = 6 - stringNum;
        const x = startX + stringIndex * stringSpacing;
        const y = startY - 12;

        ctx.beginPath();
        ctx.moveTo(x - 5, y - 5);
        ctx.lineTo(x + 5, y + 5);
        ctx.moveTo(x + 5, y - 5);
        ctx.lineTo(x - 5, y + 5);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [chordName, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border rounded-lg shadow-lg bg-white"
    />
  );
};
