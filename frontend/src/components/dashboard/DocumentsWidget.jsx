// src/components/dashboard/DocumentsWidget.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Calendar } from 'lucide-react';

const DocumentsWidget = ({ documents = [] }) => {
  // Berechnen der verbleibenden Tage bis zum Ablauf eines Dokuments
  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Bestimmen der Farbe basierend auf der verbleibenden Zeit bis zum Ablauf
  const getExpirationColor = (days) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 14) return 'text-orange-500';
    if (days <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  // Sortiere Dokumente nach Ablaufdatum (die am frühesten ablaufenden zuerst)
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(a.expiryDate) - new Date(b.expiryDate)
  );
  
  return (
    <div className="space-y-3">
      {sortedDocuments.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Keine bald ablaufenden Dokumente</p>
        </div>
      ) : (
        <>
          {sortedDocuments.map(doc => {
            const daysRemaining = calculateDaysRemaining(doc.expiryDate);
            const colorClass = getExpirationColor(daysRemaining);
            
            return (
              <Link
                key={doc._id || doc.id} 
                to={`/documents/${doc._id || doc.id}`}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 block"
              >
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.category}</p>
                  </div>
                </div>
                <div className={`flex items-center ${colorClass}`}>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tage'}
                  </span>
                </div>
              </Link>
            );
          })}
          <Link to="/documents" className="block mt-2 text-blue-600 text-sm font-medium hover:text-blue-800">
            Alle Dokumente anzeigen
          </Link>
        </>
      )}
    </div>
  );
};

export default DocumentsWidget;