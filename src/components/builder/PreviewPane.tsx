'use client';

import React, { useEffect, useRef } from 'react';
import { ThemeValues } from './ThemeEditor';

interface PreviewPaneProps {
  theme: ThemeValues;
  content: React.ReactNode;
  scale?: number;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ 
  theme, 
  content,
  scale = 0.7 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;
    
    // Apply theme to iframe content
    const style = iframeDoc.createElement('style');
    style.textContent = `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-background: ${theme.colors.background};
        --color-text: ${theme.colors.text};
        
        --font-heading: ${theme.typography.headingFont}, sans-serif;
        --font-body: ${theme.typography.bodyFont}, sans-serif;
        --font-size-base: ${theme.typography.baseSize}px;
        --font-scale: ${theme.typography.scale};
        
        --spacing-padding: ${theme.spacing.basePadding}px;
        --spacing-margin: ${theme.spacing.baseMargin}px;
        --spacing-section-gap: ${theme.spacing.sectionGap}px;
      }
      
      body {
        background-color: var(--color-background);
        color: var(--color-text);
        font-family: var(--font-body);
        font-size: var(--font-size-base);
        margin: 0;
        padding: 0;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading);
        color: var(--color-text);
      }
      
      h1 { font-size: calc(var(--font-size-base) * var(--font-scale) * var(--font-scale) * var(--font-scale)); }
      h2 { font-size: calc(var(--font-size-base) * var(--font-scale) * var(--font-scale)); }
      h3 { font-size: calc(var(--font-size-base) * var(--font-scale)); }
      
      section {
        padding: var(--spacing-padding);
        margin-bottom: var(--spacing-section-gap);
      }
      
      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
      
      .btn-secondary {
        background-color: var(--color-secondary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
    `;
    
    iframeDoc.head.appendChild(style);
    
    // Add the React content to the iframe body
    const contentString = typeof content === 'string' 
      ? content 
      : '<div id="root"></div>';
    
    iframeDoc.body.innerHTML = contentString;
    
    // If content is a React component, render it to the root div
    if (typeof content !== 'string' && content) {
      const root = iframeDoc.getElementById('root');
      if (root) {
        // In a real implementation, you would use ReactDOM.render or createRoot here
        // This is simplified for demonstration purposes
      }
    }
  }, [theme, content]);
  
  return (
    <div className="preview-container flex flex-col h-full">
      <div className="preview-header bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700 flex items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h3>
        <div className="flex-1" />
        <div className="flex space-x-1">
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
            aria-label="Mobile view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
            aria-label="Tablet view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
            aria-label="Desktop view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="preview-frame-container bg-gray-200 dark:bg-gray-900 flex-1 overflow-auto p-4">
        <div 
          className="preview-frame bg-white shadow-lg mx-auto transition-all duration-300 ease-in-out"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            height: `${100 / scale}%`,
            width: '100%',
            maxWidth: '1200px',
            overflow: 'hidden'
          }}
        >
          <iframe
            ref={iframeRef}
            title="Site Preview"
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}; 