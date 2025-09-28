
import React from 'react';

interface DurationSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

export const DurationSlider: React.FC<DurationSliderProps> = ({ value, onChange, min, max }) => {
  return (
    <div>
      <label htmlFor="duration" className="block text-sm font-medium text-slate-300 mb-2">
        Duration: <span className="font-bold text-indigo-400">{value}s</span>
      </label>
      <input
        id="duration"
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
};
