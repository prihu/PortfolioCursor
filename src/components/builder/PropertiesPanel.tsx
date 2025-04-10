'use client';

import React, { useState, useEffect } from 'react';

interface CanvasElement {
  id: string;
  type: string;
  props: Record<string, any>;
  children: CanvasElement[];
  parent: string | null;
  styles: Record<string, string>;
}

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onElementUpdate: (updatedElement: CanvasElement) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onElementUpdate,
}) => {
  const [localStyles, setLocalStyles] = useState<Record<string, string>>({});
  const [localProps, setLocalProps] = useState<Record<string, any>>({});

  // Update local state when selected element changes
  useEffect(() => {
    if (selectedElement) {
      setLocalStyles(selectedElement.styles);
      setLocalProps(selectedElement.props);
    } else {
      setLocalStyles({});
      setLocalProps({});
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="p-4 border-l border-gray-200 h-full">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Properties</h2>
        <p className="text-gray-500 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  // Handle style property change
  const handleStyleChange = (property: string, value: string) => {
    const updatedStyles = { ...localStyles, [property]: value };
    setLocalStyles(updatedStyles);
    onElementUpdate({
      ...selectedElement,
      styles: updatedStyles,
    });
  };

  // Handle prop change
  const handlePropChange = (propName: string, value: any) => {
    const updatedProps = { ...localProps, [propName]: value };
    setLocalProps(updatedProps);
    onElementUpdate({
      ...selectedElement,
      props: updatedProps,
    });
  };

  // Render different property editors based on element type
  const renderElementProperties = () => {
    switch (selectedElement.type) {
      case 'heading':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading Text</label>
              <input
                type="text"
                value={localProps.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Heading Level</label>
              <select
                value={localProps.level || 2}
                onChange={(e) => handlePropChange('level', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case 'paragraph':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
            <textarea
              value={localProps.content || ''}
              onChange={(e) => handlePropChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
            />
          </div>
        );

      case 'button':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
              <input
                type="text"
                value={localProps.content || ''}
                onChange={(e) => handlePropChange('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Type</label>
              <select
                value={localProps.variant || 'primary'}
                onChange={(e) => handlePropChange('variant', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
              <input
                type="text"
                value={localProps.url || ''}
                onChange={(e) => handlePropChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com"
              />
            </div>
          </>
        );

      case 'image':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={localProps.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <input
                type="text"
                value={localProps.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe the image"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 border-l border-gray-200 h-full overflow-y-auto">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} Properties
      </h2>
      
      {/* Element-specific properties */}
      {renderElementProperties()}
      
      {/* Common style properties */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-md font-medium text-gray-700 mb-3">Styles</h3>
        
        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <input
              type="text"
              value={localStyles.width || ''}
              onChange={(e) => handleStyleChange('width', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="auto, 100px, 50%"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
            <input
              type="text"
              value={localStyles.height || ''}
              onChange={(e) => handleStyleChange('height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="auto, 100px, 50%"
            />
          </div>
        </div>
        
        {/* Position */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={localStyles.position || 'static'}
              onChange={(e) => handleStyleChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="static">Static</option>
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Z-Index</label>
            <input
              type="number"
              value={localStyles.zIndex || ''}
              onChange={(e) => handleStyleChange('zIndex', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        {/* Spacing */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={localStyles.marginTop || ''}
              onChange={(e) => handleStyleChange('marginTop', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Top"
            />
            <input
              type="text"
              value={localStyles.marginRight || ''}
              onChange={(e) => handleStyleChange('marginRight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Right"
            />
            <input
              type="text"
              value={localStyles.marginBottom || ''}
              onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Bottom"
            />
            <input
              type="text"
              value={localStyles.marginLeft || ''}
              onChange={(e) => handleStyleChange('marginLeft', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Left"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
          <div className="grid grid-cols-4 gap-2">
            <input
              type="text"
              value={localStyles.paddingTop || ''}
              onChange={(e) => handleStyleChange('paddingTop', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Top"
            />
            <input
              type="text"
              value={localStyles.paddingRight || ''}
              onChange={(e) => handleStyleChange('paddingRight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Right"
            />
            <input
              type="text"
              value={localStyles.paddingBottom || ''}
              onChange={(e) => handleStyleChange('paddingBottom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Bottom"
            />
            <input
              type="text"
              value={localStyles.paddingLeft || ''}
              onChange={(e) => handleStyleChange('paddingLeft', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Left"
            />
          </div>
        </div>
        
        {/* Colors */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
            <div className="flex">
              <input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-l-md"
              />
              <input
                type="text"
                value={localStyles.backgroundColor || ''}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md"
                placeholder="#ffffff or rgba()"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex">
              <input
                type="color"
                value={localStyles.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-10 h-10 border border-gray-300 rounded-l-md"
              />
              <input
                type="text"
                value={localStyles.color || ''}
                onChange={(e) => handleStyleChange('color', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md"
                placeholder="#000000 or rgba()"
              />
            </div>
          </div>
        </div>
        
        {/* Typography */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Font</label>
          <select
            value={localStyles.fontFamily || ''}
            onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="">Default</option>
            <option value="'Arial', sans-serif">Arial</option>
            <option value="'Helvetica', sans-serif">Helvetica</option>
            <option value="'Georgia', serif">Georgia</option>
            <option value="'Verdana', sans-serif">Verdana</option>
            <option value="'Courier New', monospace">Courier New</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input
                type="text"
                value={localStyles.fontSize || ''}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="16px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <select
                value={localStyles.fontWeight || ''}
                onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Default</option>
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Border */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Border</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              value={localStyles.borderWidth || ''}
              onChange={(e) => handleStyleChange('borderWidth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Width"
            />
            <select
              value={localStyles.borderStyle || ''}
              onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Style</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
            <div className="flex">
              <input
                type="color"
                value={localStyles.borderColor || '#000000'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-10 h-full border border-gray-300 rounded-l-md"
              />
              <input
                type="text"
                value={localStyles.borderColor || ''}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-r-md"
                placeholder="Color"
              />
            </div>
          </div>
          <input
            type="text"
            value={localStyles.borderRadius || ''}
            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Border Radius (e.g., 4px, 50%)"
          />
        </div>
      </div>
    </div>
  );
}; 