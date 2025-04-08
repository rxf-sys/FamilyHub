// src/components/documents/DocumentList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Tag,
  Image,
  File
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const DocumentList = ({ documents, categories, onDocumentClick, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  
  // Dokumente filtern
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'Alle' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Dateigröße formatieren
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Dokumente</h2>
        <Link 
          to="/documents/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Neues Dokument
        </Link>
      </div>
      
      {/* Suchleiste und Filter */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Dokumente durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full md:w-48 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Alle">Alle Kategorien</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Dokumente-Liste */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Dokumente gefunden</h3>
          <p className="mt-1 text-sm text-gray-500">
            Fügen Sie neue Dokumente hinzu oder ändern Sie Ihre Suchkriterien.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredDocuments.map(document => (
              <li key={document.id}>
                <div className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => onDocumentClick(document)}
                      >
                        <div className="flex-shrink-0 text-gray-500">
                          {getFileIcon(document.fileType)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {document.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {document.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-2 flex-shrink-0 flex">
                        <button
                          onClick={() => onDownload(document)}
                          className="p-2 text-gray-500 hover:text-blue-500 focus:outline-none"
                          title="Herunterladen"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-4">
                        <p className="flex items-center text-sm text-gray-500">
                          <Tag className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {document.category}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Hochgeladen am {format(new Date(document.uploadDate), 'dd.MM.yyyy', { locale: de })}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {formatFileSize(document.fileSize)}
                      </div>
                    </div>
                    
                    {document.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap">
                        {document.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="mr-2 mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentList;