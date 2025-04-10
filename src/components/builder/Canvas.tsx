'use client';

import React, { useState, useRef } from 'react';

interface CanvasProps {
  onSelectionChange?: (elementId: string | null) => void;
}

interface CanvasElement {
  id: string;
  type: string;
  props: Record<string, any>;
  children: CanvasElement[];
  parent: string | null;
  styles: Record<string, string>;
}

export const Canvas: React.FC<CanvasProps> = ({ onSelectionChange }) => {
  // State to manage the elements on the canvas
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle dropping elements onto the canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    // Get element ID from the drag data
    const elementType = e.dataTransfer.getData('element/id');
    if (!elementType) return;
    
    // Calculate position relative to the canvas
    const canvasRect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;
    
    // Create new element
    const newElement: CanvasElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      props: {},
      children: [],
      parent: null,
      styles: {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: elementType === 'section' ? '100%' : '200px',
        height: elementType === 'section' ? '100px' : 'auto',
      }
    };
    
    // Add default props based on element type
    switch (elementType) {
      case 'heading':
        newElement.props.content = 'Heading';
        newElement.props.level = 2;
        break;
      case 'paragraph':
        newElement.props.content = 'This is a paragraph of text. Double-click to edit.';
        break;
      case 'button':
        newElement.props.content = 'Button';
        break;
      case 'image':
        newElement.props.src = 'https://via.placeholder.com/200x150';
        newElement.props.alt = 'Placeholder image';
        newElement.styles.width = '200px';
        newElement.styles.height = '150px';
        break;
      case 'section':
        newElement.styles.backgroundColor = '#f5f5f5';
        break;
      case 'container':
        newElement.styles.padding = '20px';
        newElement.styles.backgroundColor = '#ffffff';
        newElement.styles.border = '1px dashed #cccccc';
        break;
    }
    
    // Add the new element to the canvas
    setElements(prev => [...prev, newElement]);
    
    // Select the newly added element
    setSelectedElement(newElement.id);
    if (onSelectionChange) onSelectionChange(newElement.id);
  };

  // Handle selecting an element
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    if (onSelectionChange) onSelectionChange(elementId);
  };
  
  // Clear selection when clicking on the canvas background
  const handleCanvasClick = () => {
    setSelectedElement(null);
    if (onSelectionChange) onSelectionChange(null);
  };

  // Handle drag over to enable dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Render different element types
  const renderElement = (element: CanvasElement) => {
    const isSelected = selectedElement === element.id;
    const baseStyles = {
      ...element.styles,
      outline: isSelected ? '2px solid #3b82f6' : 'none',
    };
    
    // Wrapper for all elements
    const ElementWrapper = ({ children }: { children: React.ReactNode }) => (
      <div
        id={element.id}
        style={baseStyles}
        onClick={(e) => handleElementClick(element.id, e)}
        className="relative"
      >
        {children}
        {isSelected && (
          <div className="absolute -top-4 -right-4 bg-blue-500 text-white text-xs px-1 rounded">
            {element.type}
          </div>
        )}
      </div>
    );
    
    switch (element.type) {
      case 'heading':
        const HeadingTag = `h${element.props.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <ElementWrapper>
            <HeadingTag className="m-0">{element.props.content || 'Heading'}</HeadingTag>
          </ElementWrapper>
        );
      
      case 'paragraph':
        return (
          <ElementWrapper>
            <p className="m-0">{element.props.content || 'Paragraph text'}</p>
          </ElementWrapper>
        );
      
      case 'button':
        return (
          <ElementWrapper>
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              {element.props.content || 'Button'}
            </button>
          </ElementWrapper>
        );
      
      case 'image':
        return (
          <ElementWrapper>
            <img
              src={element.props.src || 'https://via.placeholder.com/200x150'}
              alt={element.props.alt || 'Image'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ElementWrapper>
        );
      
      case 'section':
      case 'container':
      case 'row':
      case 'column':
        return (
          <ElementWrapper>
            <div className="w-full h-full flex items-center justify-center">
              {element.children.length === 0 && (
                <span className="text-gray-400 text-sm">
                  Drop elements here
                </span>
              )}
              {element.children.map(child => renderElement(child))}
            </div>
          </ElementWrapper>
        );
      
      default:
        return (
          <ElementWrapper>
            <div className="bg-gray-200 p-4 rounded">
              Unknown element: {element.type}
            </div>
          </ElementWrapper>
        );
    }
  };

  return (
    <div
      ref={canvasRef}
      className="canvas relative w-full h-full bg-white overflow-auto"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
    >
      {elements.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">Drag and drop elements here to build your page</p>
            <p className="text-gray-400 text-sm">
              Start by dragging elements from the panel on the left
            </p>
          </div>
        </div>
      ) : (
        elements.map(element => renderElement(element))
      )}
    </div>
  );
}; 