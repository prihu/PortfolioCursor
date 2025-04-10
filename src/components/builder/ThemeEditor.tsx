'use client';

import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Slider } from '../ui/Slider';
import { Input } from '../ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface ThemeEditorProps {
  onThemeChange: (theme: ThemeValues) => void;
  initialTheme?: ThemeValues;
}

export interface ThemeValues {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    scale: number;
  };
  spacing: {
    basePadding: number;
    baseMargin: number;
    sectionGap: number;
  };
}

const defaultTheme: ThemeValues = {
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    background: '#ffffff',
    text: '#1f2937',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    scale: 1.2,
  },
  spacing: {
    basePadding: 16,
    baseMargin: 16,
    sectionGap: 64,
  }
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ 
  onThemeChange, 
  initialTheme = defaultTheme 
}) => {
  const [theme, setTheme] = useState<ThemeValues>(initialTheme);
  const [activeColor, setActiveColor] = useState<keyof ThemeValues['colors']>('primary');

  const handleColorChange = (color: string) => {
    const newTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        [activeColor]: color
      }
    };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleTypographyChange = (key: keyof ThemeValues['typography'], value: string | number) => {
    const newTheme = {
      ...theme,
      typography: {
        ...theme.typography,
        [key]: value
      }
    };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleSpacingChange = (key: keyof ThemeValues['spacing'], value: number) => {
    const newTheme = {
      ...theme,
      spacing: {
        ...theme.spacing,
        [key]: value
      }
    };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme Editor</h2>
      
      <Tabs defaultValue="colors">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <div className="flex space-x-2 mb-4">
            {Object.entries(theme.colors).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveColor(key as keyof ThemeValues['colors'])}
                className={`h-8 w-8 rounded-full border-2 ${
                  activeColor === key ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: value }}
                aria-label={`Select ${key} color`}
              />
            ))}
          </div>
          
          <HexColorPicker 
            color={theme.colors[activeColor]} 
            onChange={handleColorChange} 
            className="w-full"
          />
          
          <div className="flex items-center">
            <span className="capitalize text-sm text-gray-700 dark:text-gray-300 w-24">
              {activeColor}:
            </span>
            <Input
              type="text"
              value={theme.colors[activeColor]}
              onChange={(e) => handleColorChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Heading Font
              </label>
              <Input
                type="text"
                value={theme.typography.headingFont}
                onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Body Font
              </label>
              <Input
                type="text"
                value={theme.typography.bodyFont}
                onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base Size: {theme.typography.baseSize}px
              </label>
              <Slider
                min={12}
                max={20}
                step={1}
                value={theme.typography.baseSize}
                onChange={(value) => handleTypographyChange('baseSize', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Scale: {theme.typography.scale.toFixed(1)}
              </label>
              <Slider
                min={1.0}
                max={1.5}
                step={0.1}
                value={theme.typography.scale}
                onChange={(value) => handleTypographyChange('scale', value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base Padding: {theme.spacing.basePadding}px
              </label>
              <Slider
                min={8}
                max={32}
                step={4}
                value={theme.spacing.basePadding}
                onChange={(value) => handleSpacingChange('basePadding', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base Margin: {theme.spacing.baseMargin}px
              </label>
              <Slider
                min={8}
                max={32}
                step={4}
                value={theme.spacing.baseMargin}
                onChange={(value) => handleSpacingChange('baseMargin', value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Section Gap: {theme.spacing.sectionGap}px
              </label>
              <Slider
                min={32}
                max={128}
                step={8}
                value={theme.spacing.sectionGap}
                onChange={(value) => handleSpacingChange('sectionGap', value)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 