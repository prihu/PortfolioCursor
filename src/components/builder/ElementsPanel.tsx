'use client';

import React from 'react';

// Define element categories and their components
const ELEMENT_CATEGORIES = [
  {
    id: 'layout',
    name: 'Layout',
    elements: [
      { id: 'section', name: 'Section', icon: 'grid' },
      { id: 'container', name: 'Container', icon: 'box' },
      { id: 'row', name: 'Row', icon: 'columns' },
      { id: 'column', name: 'Column', icon: 'sidebar' },
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    elements: [
      { id: 'heading', name: 'Heading', icon: 'type-h1' },
      { id: 'paragraph', name: 'Paragraph', icon: 'type' },
      { id: 'image', name: 'Image', icon: 'image' },
      { id: 'button', name: 'Button', icon: 'cursor-click' },
      { id: 'link', name: 'Link', icon: 'link' },
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    elements: [
      { id: 'form', name: 'Form', icon: 'list-check' },
      { id: 'video', name: 'Video', icon: 'play-circle' },
      { id: 'carousel', name: 'Carousel', icon: 'images' },
      { id: 'tabs', name: 'Tabs', icon: 'folder' },
      { id: 'accordion', name: 'Accordion', icon: 'chevrons-down' },
    ]
  }
];

// Icon component to display SVG icons
const Icon = ({ name }: { name: string }) => {
  // This is a simple placeholder for icons
  // In a real implementation, you would use a proper icon library
  return (
    <div className="w-5 h-5 flex items-center justify-center">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {name === 'grid' && (
          <path d="M3 3h18v18H3V3zm6 0v18M15 3v18M3 9h18M3 15h18" />
        )}
        {name === 'box' && (
          <rect x="3" y="3" width="18" height="18" rx="2" />
        )}
        {name === 'columns' && (
          <path d="M3 3h18v18H3V3zm9 0v18" />
        )}
        {name === 'sidebar' && (
          <path d="M3 3h18v18H3V3zm6 0v18" />
        )}
        {name === 'type-h1' && (
          <path d="M4 12h6m4 0h6M4 6v12M14 6v12" />
        )}
        {name === 'type' && (
          <path d="M4 7h16M4 12h16M4 17h10" />
        )}
        {name === 'image' && (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5-4 4-4-4-5 5" />
          </>
        )}
        {name === 'cursor-click' && (
          <path d="M9 3v8l3 3 3-3-3-3m-6 6l-3 3 3 3 3-3" />
        )}
        {name === 'link' && (
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        )}
        {name === 'list-check' && (
          <path d="M9 5h12M9 12h12M9 19h12M5 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
        )}
        {name === 'play-circle' && (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M10 8l6 4-6 4V8z" />
          </>
        )}
        {name === 'images' && (
          <>
            <rect x="5" y="5" width="14" height="10" rx="2" />
            <rect x="8" y="8" width="14" height="10" rx="2" />
          </>
        )}
        {name === 'folder' && (
          <path d="M3 6h18v14H3V6zm0 0h8l2-2h8" />
        )}
        {name === 'chevrons-down' && (
          <path d="M7 6l5 5 5-5M7 13l5 5 5-5" />
        )}
      </svg>
    </div>
  );
};

interface ElementsPanelProps {
  onElementDrag: (elementId: string) => void;
}

export const ElementsPanel: React.FC<ElementsPanelProps> = ({ onElementDrag }) => {
  // Function to handle the start of dragging an element
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData('element/id', elementId);
    onElementDrag(elementId);
  };

  return (
    <div className="elements-panel h-full overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Elements</h2>
        
        <div className="space-y-6">
          {ELEMENT_CATEGORIES.map(category => (
            <div key={category.id} className="category">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {category.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {category.elements.map(element => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    className="element-item flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-move hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                  >
                    <Icon name={element.icon} />
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                      {element.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Custom Components
        </h3>
        
        <button 
          className="w-full py-2 px-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="ml-2">Create Component</span>
        </button>
      </div>
    </div>
  );
}; 