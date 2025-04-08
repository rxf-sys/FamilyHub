// src/components/dashboard/WidgetSortableLayout.jsx
import React, { useState } from 'react';
import { Move } from 'lucide-react';

/**
 * Widget-Layout mit Sortier- und Größenänderungsfunktionen
 * Hinweis: Für die vollständige Drag-and-Drop-Funktionalität müsste eine Bibliothek wie
 * react-grid-layout oder react-beautiful-dnd integriert werden.
 * Dieser Code bietet die Grundlage für eine zukünftige Integration.
 */
const WidgetSortableLayout = ({ 
  children, 
  title, 
  onMove, 
  onResize, 
  onRemove,
  isMovable = true,
  isResizable = true,
  isRemovable = false
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div 
      className="relative bg-white rounded-lg shadow p-4"
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {/* Header mit Titel und Steuerungselementen */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        {/* Steuerungselemente (nur bei Mauszeiger sichtbar) */}
        {isMouseOver && (
          <div className="flex items-center space-x-2">
            {isMovable && (
              <button 
                className="p-1 text-gray-400 hover:text-gray-600 cursor-move"
                title="Widget verschieben"
                onMouseDown={onMove}
              >
                <Move className="h-4 w-4" />
              </button>
            )}
            
            {isResizable && (
              <div className="flex items-center border rounded overflow-hidden">
                <button 
                  className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                  onClick={() => onResize('smaller')}
                >
                  -
                </button>
                <button 
                  className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                  onClick={() => onResize('larger')}
                >
                  +
                </button>
              </div>
            )}
            
            {isRemovable && (
              <button 
                className="p-1 text-gray-400 hover:text-red-600"
                title="Widget entfernen"
                onClick={onRemove}
              >
                &times;
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Widget-Inhalt */}
      {children}
    </div>
  );
};

export default WidgetSortableLayout;