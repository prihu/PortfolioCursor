'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const percentage = ((localValue - min) / (max - min)) * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newValue = min + percentage * (max - min);
    
    // Round to step
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(Math.max(steppedValue, min), max);
    
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    
    // Capture pointer to track drag outside the element
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || disabled) return;
    
    const track = trackRef.current;
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newValue = min + percentage * (max - min);
    
    // Round to step
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(Math.max(steppedValue, min), max);
    
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.userSelect = '';
      
      // Release pointer capture
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className={`h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleTrackClick}
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`absolute w-4 h-4 rounded-full bg-white border-2 border-blue-500 top-1/2 -translate-y-1/2 -ml-2 cursor-grab ${
            isDragging ? 'cursor-grabbing' : ''
          }`}
          style={{ left: `${percentage}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}; 