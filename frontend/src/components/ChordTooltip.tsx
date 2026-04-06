import React, { useState } from 'react';
import { GuitarChordCanvas } from './GuitarChordCanvas';

interface ChordTooltipProps {
  chord: string;
  children: React.ReactNode;
}

export const ChordTooltip: React.FC<ChordTooltipProps> = ({ chord, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="cursor-help inline-block"
      >
        {children}
      </div>

      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <GuitarChordCanvas chordName={chord} width={180} height={220} />
        </div>
      )}
    </div>
  );
};
