// src/components/documents/DocumentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AlertCircle, 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Download, 
  Calendar, 
  FileText,
  Users,
  Tag,
  File,
  Image,
  Eye
} from 'lucide-react';
import api from '../../api/api';

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    loadDocument();
  }, [id]);
  
  const loadDocument = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/documents/${id}`);
      const documentData = response.data.data;
      
      setDocument(documentData);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Dokuments:', err);
      setError('Dokument konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      setLoading(true);
      
      // In einer echten Anwendung wird hier der Download gestartet
      await api.get(`/documents/${id}/download`, {
        responseType: 'blob'
      }).then(response => {
        // Blob-Download erzeugen
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', document.fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
      
      setError(null);
    } catch (err) {
      console.error('Fehler beim Herunterladen des Dokuments:', err);
      setError('Dokument konnte nicht heruntergeladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      await api.delete(`/documents/${id}`);
      
      navigate('/documents');
    } catch (err) {
      console.error('Fehler beim Löschen des Dokuments:', err);
      setError('Das Dokument konnte nicht gelöscht werden.');
      setShowDeleteConfirm(false);
      setLoading(false);
    }
  };
  
  // Helfer-Funktion zur Formatierung des Datums
  const formatDate = (dateString) => {
    if (!dateString) return 'Nicht angegeben';
    
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Helfer-Funktion zur Formatierung der Dateigröße
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };
  
  // Dateityp-Icon auswählen
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-5 w-5" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };
  
  if (loading && !document) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/documents')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {document?.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Herunterladen"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate(`/documents/${id}/edit`)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Bearbeiten"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            title="Löschen"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
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
      
      {document && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hauptinformationen */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Dokumentdetails
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Informationen über dieses Dokument.
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Dateiname</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {document.fileName}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Beschreibung</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {document.description || 'Keine Beschreibung vorhanden'}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Kategorie</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {document.category}
                    </dd>
                  </div>
                  
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Dateigröße</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatFileSize(document.fileSize)}
                    </dd>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Hochgeladen am</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(document.uploadDate)}
                    </dd>
                  </div>
                  
                  {document.expiryDate && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Läuft ab am</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {formatDate(document.expiryDate)}
                      </dd>
                    </div>
                  )}
                  
                  {document.family && (
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Geteilt mit</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Familie {document.isShared ? '' : '(nicht sichtbar)'}
                      </dd>
                    </div>
                  )}
                  
                  {document.tags && document.tags.length > 0 && (
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Tags</dt>
                      <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
          
          {/* Seitenleiste */}
          <div className="space-y-6">
            {/* Dateivorschau */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Vorschau
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 flex flex-col items-center justify-center">
                  {document.fileType.startsWith('image/') ? (
                    <img 
                      src={`/api/documents/${id}/preview`} 
                      alt={document.name}
                      className="max-w-full h-auto rounded"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto h-20 w-20 text-gray-400">
                        {getFileIcon(document.fileType)}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Keine Vorschau verfügbar
                      </p>
                      <button
                        onClick={handleDownload}
                        className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Herunterladen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Ablaufinformationen */}
            {document.expiryDate && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ablaufinformationen
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Läuft ab am:</span>
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatDate(document.expiryDate)}
                  </p>
                  
                  {/* Berechnung der verbleibenden Tage */}
                  {(() => {
                    const today = new Date();
                    const expiryDate = new Date(document.expiryDate);
                    const diffTime = expiryDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    let statusClass = 'bg-green-100 text-green-800';
                    let statusText = `${diffDays} Tage verbleibend`;
                    
                    if (diffDays <= 0) {
                      statusClass = 'bg-red-100 text-red-800';
                      statusText = 'Abgelaufen';
                    } else if (diffDays <= 30) {
                      statusClass = 'bg-yellow-100 text-yellow-800';
                      statusText = `Nur noch ${diffDays} Tage`;
                    }
                    
                    return (
                      <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
                        {statusText}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Löschen-Bestätigungsdialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900">Dokument löschen</h3>
            <p className="mt-2 text-sm text-gray-500">
              Sind Sie sicher, dass Sie dieses Dokument löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetail;