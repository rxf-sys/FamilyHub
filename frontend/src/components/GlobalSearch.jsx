// src/components/GlobalSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, ShoppingCart, Utensils, Pill, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Öffne die Suche mit Strg+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Schließe die Suche mit Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  useEffect(() => {
    // Fokussiere das Suchfeld, wenn es geöffnet wird
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Suche ausführen, wenn sich die Abfrage ändert
    if (query.length > 2) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query]);
  
  const performSearch = () => {
    setLoading(true);
    
    // In einer echten App würden hier API-Aufrufe erfolgen
    // Simulierte Suche:
    setTimeout(() => {
      const demoResults = [
        {
          id: '1',
          type: 'calendar',
          title: 'Arzttermin',
          description: '15. April 2025, 14:30 Uhr',
          icon: <Calendar className="h-5 w-5 text-blue-500" />
        },
        {
          id: '2',
          type: 'shopping',
          title: 'Wocheneinkauf',
          description: '12 Artikel, 2 erledigt',
          icon: <ShoppingCart className="h-5 w-5 text-green-500" />
        },
        {
          id: '3',
          type: 'meals',
          title: 'Spaghetti Bolognese',
          description: 'Rezept für 4 Personen',
          icon: <Utensils className="h-5 w-5 text-orange-500" />
        },
        {
          id: '4',
          type: 'medications',
          title: 'Ibuprofen',
          description: '400mg, 20 Tabletten übrig',
          icon: <Pill className="h-5 w-5 text-red-500" />
        },
        {
          id: '5',
          type: 'documents',
          title: 'Mietvertrag',
          description: 'PDF, 1.25 MB',
          icon: <FileText className="h-5 w-5 text-purple-500" />
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(demoResults);
      setLoading(false);
    }, 500);
  };
  
  const handleResultClick = (result) => {
    setIsOpen(false);
    
    // Navigation zu verschiedenen Modulen basierend auf dem Ergebnistyp
    switch (result.type) {
      case 'calendar':
        navigate('/calendar');
        break;
      case 'shopping':
        navigate(`/shopping/${result.id}`);
        break;
      case 'meals':
        navigate('/meals');
        break;
      case 'medications':
        navigate('/medications');
        break;
      case 'documents':
        navigate('/documents');
        break;
      default:
        navigate('/dashboard');
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <Search className="h-4 w-4 mr-2" />
        <span>Suchen...</span>
        <span className="ml-2 text-xs text-gray-400">⌘K</span>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl mt-16 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Suchen Sie nach Terminen, Einkäufen, Rezepten, Medikamenten oder Dokumenten..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 focus:outline-none"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {results.map(result => (
                <li
                  key={`${result.type}-${result.id}`}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {result.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{result.title}</p>
                      <p className="text-sm text-gray-500">{result.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length > 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Keine Ergebnisse für "{query}" gefunden.</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>Geben Sie mindestens 3 Zeichen ein, um die Suche zu starten.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;