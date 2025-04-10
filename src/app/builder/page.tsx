'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@/components/builder/Canvas';
import { ElementsPanel } from '@/components/builder/ElementsPanel';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { ThemeEditor } from '@/components/builder/ThemeEditor';
import { PreviewPane } from '@/components/builder/PreviewPane';
import { ThemeValues } from '@/components/builder/ThemeEditor';

interface CanvasElement {
  id: string;
  type: string;
  props: Record<string, any>;
  children: CanvasElement[];
  parent: string | null;
  styles: Record<string, string>;
}

export default function BuilderPage() {
  // State for the site theme
  const [theme, setTheme] = useState<ThemeValues>({
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
  });
  
  // State for selected element and canvas elements
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [elements, setElements] = useState<CanvasElement[]>([]);
  
  // State for active tab and preview mode
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isDragging, setIsDragging] = useState(false);

  // Get the selected element from the elements array
  const selectedElement = selectedElementId 
    ? elements.find(el => el.id === selectedElementId) || null
    : null;

  // Handle updates to elements
  const handleElementUpdate = (updatedElement: CanvasElement) => {
    setElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: ThemeValues) => {
    setTheme(newTheme);
  };
  
  // Handle element dragging
  const handleElementDrag = (elementId: string) => {
    setIsDragging(true);
  };
  
  // Reset dragging state when drag ends
  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('dragend', handleDragEnd);
    return () => {
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  // Generate preview HTML based on elements and theme
  const generatePreviewContent = () => {
    // This would be a more complex function in a real implementation
    // For now, we'll return a simple HTML string with the theme applied
    return `
      <div style="padding: 20px; font-family: ${theme.typography.bodyFont}">
        <h1 style="color: ${theme.colors.text}; font-family: ${theme.typography.headingFont}">
          Website Preview
        </h1>
        <p style="color: ${theme.colors.text}">
          This is a preview of your website with the selected theme applied.
        </p>
        <button style="
          background-color: ${theme.colors.primary}; 
          color: white; 
          border: none; 
          padding: 8px 16px; 
          border-radius: 4px;
          cursor: pointer;
        ">
          Primary Button
        </button>
        <button style="
          background-color: ${theme.colors.secondary}; 
          color: white; 
          border: none; 
          padding: 8px 16px; 
          border-radius: 4px;
          margin-left: 8px;
          cursor: pointer;
        ">
          Secondary Button
        </button>
      </div>
    `;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Visual Website Builder
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex border rounded overflow-hidden">
              <button
                className={`px-4 py-1 text-sm ${
                  activeTab === 'editor'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                Editor
              </button>
              <button
                className={`px-4 py-1 text-sm ${
                  activeTab === 'preview'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
            </div>
            
            <button className="px-4 py-1 rounded bg-green-500 text-white text-sm">
              Save
            </button>
            <button className="px-4 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
              Exit
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'editor' ? (
          // Editor Interface
          <div className="flex-1 flex h-full">
            {/* Left Panel - Elements */}
            <div className="w-64 bg-white dark:bg-gray-800 overflow-auto">
              <ElementsPanel onElementDrag={handleElementDrag} />
            </div>
            
            {/* Center - Canvas */}
            <div className="flex-1 overflow-auto relative">
              <Canvas onSelectionChange={setSelectedElementId} />
              
              {isDragging && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none z-10 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg text-sm">
                    Drop element here to add it to the canvas
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Panel - Properties or Theme */}
            <div className="w-80 bg-white dark:bg-gray-800 overflow-auto">
              {selectedElement ? (
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onElementUpdate={handleElementUpdate}
                />
              ) : (
                <ThemeEditor
                  onThemeChange={handleThemeChange}
                  initialTheme={theme}
                />
              )}
            </div>
          </div>
        ) : (
          // Preview Interface
          <div className="flex-1 h-full">
            <PreviewPane
              theme={theme}
              content={generatePreviewContent()}
              scale={0.8}
            />
          </div>
        )}
      </main>
      
      {/* Status Bar */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <div>
          {selectedElement ? (
            <span>Selected: {selectedElement.type} (ID: {selectedElement.id})</span>
          ) : (
            <span>No element selected</span>
          )}
        </div>
        <div>
          {elements.length} elements on canvas
        </div>
      </footer>
    </div>
  );
} 