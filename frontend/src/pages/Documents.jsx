// src/pages/Documents.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, Upload, FilePlus } from 'lucide-react';
import { documentService } from '../services/documentService';
import DocumentList from '../components/documents/DocumentList';
import ExpiringDocuments from '../components/documents/ExpiringDocuments';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expiringDocs, setExpiringDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDocumentDetail, setShowDocumentDetail] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Parallel laden
      const [docsData, catsData, expiringData] = await Promise.all([
        documentService.getDocuments(),
        documentService.getCategories(),
        documentService.getExpiringDocuments(30)
      ]);
      
      setDocuments(docsData);
      setCategories(catsData);
      setExpiringDocs(expiringData);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Dokumentendaten:', err);
      setError('Daten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setShowDocumentDetail(true);
  };
  
  const handleDownload = async (document) => {
    try {
      await documentService.downloadDocument(document.id);
      // In einer realen App würde hier die Datei heruntergeladen
      alert(`Dokument "${document.name}" wurde heruntergeladen.`);
    } catch (err) {
      console.error('Fehler beim Herunterladen:', err);
      setError('Das Dokument konnte nicht heruntergeladen werden.');
    }
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dokumentenorganisator</h1>
        <p className="text-gray-600">Verwalten und speichern Sie Ihre wichtigen Dokumente sicher an einem Ort.</p>
      </div>
      
      {/* Fehlermeldung */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload-Bereich */}
      <div className="bg-blue-50 border border-dashed border-blue-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-blue-400" />
        <h3 className="mt-2 text-sm font-medium text-blue-900">Dokument hochladen</h3>
        <p className="mt-1 text-sm text-blue-500">
          Ziehen Sie eine Datei hierher oder klicken Sie, um eine Datei auszuwählen
        </p>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FilePlus className="-ml-1 mr-2 h-5 w-5" />
            Datei auswählen
          </button>
        </div>
      </div>
      
      {/* Ladeanzeige */}
      {loading && !documents.length ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hauptliste der Dokumente */}
          <div className="lg:col-span-2">
            <DocumentList 
              documents={documents} 
              categories={categories}
              onDocumentClick={handleDocumentClick} 
              onDownload={handleDownload}
            />
          </div>
          
          {/* Bald ablaufende Dokumente */}
          <div className="lg:col-span-1">
            <ExpiringDocuments 
              documents={expiringDocs} 
              onDocumentClick={handleDocumentClick} 
            />
          </div>
        </div>
      )}
      
      {/* Dokument-Detail-Modal */}
      {showDocumentDetail && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{selectedDocument.name}</h2>
              <button 
                onClick={() => setShowDocumentDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Kategorie</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Dateigröße</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {(selectedDocument.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Hochgeladen am</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedDocument.uploadDate).toLocaleDateString('de-DE')}
                  </p>
                </div>
                {selectedDocument.expiryDate && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Läuft ab am</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedDocument.expiryDate).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedDocument.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Beschreibung</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.description}</p>
                </div>
              )}
              
              {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                  <div className="mt-1 flex flex-wrap">
                    {selectedDocument.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="mr-2 mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Datei-Vorschau</h3>
                <div className="h-48 flex items-center justify-center bg-gray-100 border border-gray-200 rounded">
                  <p className="text-gray-400">Vorschau nicht verfügbar</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDocumentDetail(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Schließen
                </button>
                <button
                  onClick={() => handleDownload(selectedDocument)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Herunterladen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;