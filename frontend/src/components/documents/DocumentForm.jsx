// src/components/documents/DocumentForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Upload, Plus, Minus, X, Users, Tag } from 'lucide-react';
import api from '../../api/api';

const DocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sonstiges',
    expiryDate: '',
    isShared: false,
    tags: []
  });
  
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [families, setFamilies] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Verfügbare Kategorien
  const categories = [
    'Verträge',
    'Versicherungen',
    'Persönliche Dokumente',
    'Finanzen',
    'Gesundheit',
    'Bildung',
    'Haus & Wohnung',
    'Fahrzeuge',
    'Sonstiges'
  ];
  
  useEffect(() => {
    loadFamilies();
    
    if (isEditMode) {
      loadDocument();
    }
  }, [id]);
  
  const loadDocument = async () => {
    try {
      setLoading(true);
      
      // In einer realen App würde hier die API aufgerufen werden
      const response = await api.get(`/documents/${id}`);
      const document = response.data.data;
      
      // Formatiere das Ablaufdatum für die Eingabe
      let formattedData = { ...document };
      if (document.expiryDate) {
        formattedData.expiryDate = new Date(document.expiryDate).toISOString().split('T')[0];
      }
      
      setFormData(formattedData);
      setFileName(document.fileName);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden des Dokuments:', err);
      setError('Dokument konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadFamilies = async () => {
    try {
      // In einer realen App würde hier die API aufgerufen werden
      // Simulierte Antwort
      const mockFamilies = [
        { id: '1', name: 'Mustermann Familie' },
        { id: '2', name: 'Arbeitskollegen' }
      ];
      
      setFamilies(mockFamilies);
    } catch (err) {
      console.error('Fehler beim Laden der Familien:', err);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Wenn kein Name gesetzt wurde, den Dateinamen als Standard verwenden
      if (!formData.name) {
        // Entferne die Dateierweiterung für den Namen
        const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({ ...prev, name: nameWithoutExtension }));
      }
    }
  };
  
  const handleTagAdd = () => {
    if (!newTag.trim()) return;
    
    if (!formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
    }
    
    setNewTag('');
  };
  
  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEditMode && !file) {
      setError('Bitte wählen Sie eine Datei aus.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Formular-Daten für den Upload vorbereiten
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          // Tags als Komma-getrennte Liste senden
          formDataToSend.append(key, formData[key].join(','));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Datei nur bei neuem Dokument oder wenn geändert hinzufügen
      if (file) {
        formDataToSend.append('document', file);
      }
      
      if (isEditMode) {
        // Bestehendes Dokument aktualisieren
        await api.put(`/documents/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        navigate(`/documents/${id}`);
      } else {
        // Neues Dokument erstellen
        const response = await api.post('/documents', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        navigate(`/documents/${response.data.data.id}`);
      }
    } catch (err) {
      console.error('Fehler beim Speichern des Dokuments:', err);
      setError('Dokument konnte nicht gespeichert werden.');
      setLoading(false);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => navigate('/documents')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Dokument bearbeiten' : 'Neues Dokument'}
        </h1>
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
      
      {/* Formular */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="space-y-6">
          {/* Dateiupload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dokument {isEditMode ? '(optional)' : '*'}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span onClick={triggerFileInput}>Datei auswählen</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">oder hierher ziehen</p>
                </div>
                {fileName ? (
                  <p className="text-sm text-gray-700">
                    Ausgewählt: {fileName}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    PDF, Word, Excel, Bilder und andere Dokumenttypen
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Dokumentdetails */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Dokumentdetails</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Kategorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Beschreibung
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Optionale Beschreibung für dieses Dokument"
                ></textarea>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Ablaufdatum (optional)
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Für Dokumente, die ein Ablaufdatum haben (z.B. Ausweise, Versicherungen)
                </p>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="family" className="block text-sm font-medium text-gray-700">
                  Mit Familie teilen
                </label>
                <select
                  id="family"
                  name="family"
                  value={formData.family || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Keine Familie</option>
                  {families.map(family => (
                    <option key={family.id} value={family.id}>{family.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="isShared"
                      name="isShared"
                      type="checkbox"
                      checked={formData.isShared}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isShared" className="font-medium text-gray-700">
                      Mit Familienmitgliedern teilen
                    </label>
                    <p className="text-gray-500">
                      Wenn aktiviert, können Familienmitglieder dieses Dokument sehen und herunterladen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Tags</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tags helfen Ihnen, Dokumente schneller zu finden.
            </p>
            <div className="mt-4 flex">
              <div className="flex-grow">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="focus:ring-blue-500 focus:border-blue-500 flex-grow block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    placeholder="Neuen Tag hinzufügen"
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 hover:text-blue-900 items-center justify-center"
                  >
                    <span className="sr-only">Tag entfernen</span>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Speichern- und Abbrechen-Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Wird gespeichert...' : isEditMode ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;