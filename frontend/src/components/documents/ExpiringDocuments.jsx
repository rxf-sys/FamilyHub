// src/components/documents/ExpiringDocuments.jsx
import React from 'react';
import { AlertTriangle, Calendar } from 'lucide-react';

const ExpiringDocuments = ({ documents, onDocumentClick }) => {
  // Gruppieren der Dokumente nach Ablaufzeitraum
  const sortedDocuments = [...documents].sort((a, b) => 
    new Date(a.expiryDate) - new Date(b.expiryDate)
  );
  
  // Berechnen der verbleibenden Tage
  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Bald ablaufende Dokumente
        </h3>
      </div>
      
      {sortedDocuments.length === 0 ? (
        <div className="px-4 py-5 sm:p-6 text-center">
          <p className="text-sm text-gray-500">
            Keine Dokumente laufen in den nächsten 30 Tagen ab.
          </p>
        </div>
      ) : (
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {sortedDocuments.map(document => {
              const daysRemaining = calculateDaysRemaining(document.expiryDate);
              
              return (
                <li key={document.id}>
                  <div 
                    className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onDocumentClick(document)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {document.name}
                      </p>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          daysRemaining <= 7 
                            ? 'bg-red-100 text-red-800' 
                            : daysRemaining <= 14
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          Läuft ab in {daysRemaining} {daysRemaining === 1 ? 'Tag' : 'Tagen'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {new Date(document.expiryDate).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExpiringDocuments;