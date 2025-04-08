// src/components/dashboard/ShoppingWidget.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';

const ShoppingWidget = ({ lists = [] }) => {
  // Berechne die Anzahl der erledigten Artikel
  const getCompletedItemsCount = (list) => {
    return list.items.filter(item => item.completed).length;
  };
  
  return (
    <div className="space-y-3">
      {lists.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Keine dringenden Einkaufslisten</p>
        </div>
      ) : (
        <>
          {lists.map(list => (
            <Link
              key={list._id || list.id}
              to={`/shopping/${list._id || list.id}`}
              className="flex items-center justify-between p-2 rounded hover:bg-gray-50 block"
            >
              <div className="flex items-center">
                {list.isUrgent && (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">{list.name}</p>
                  <p className="text-sm text-gray-500">
                    {getCompletedItemsCount(list)}/{list.items.length} Artikel erledigt
                  </p>
                </div>
              </div>
              {list.dueDate && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                  Fällig am {new Date(list.dueDate).toLocaleDateString('de-DE')}
                </span>
              )}
            </Link>
          ))}
          <Link to="/shopping" className="block mt-2 text-blue-600 text-sm font-medium hover:text-blue-800">
            Alle Einkaufslisten anzeigen
          </Link>
        </>
      )}
    </div>
  );
};

export default ShoppingWidget;