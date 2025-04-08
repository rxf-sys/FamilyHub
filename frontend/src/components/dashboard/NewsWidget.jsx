// src/components/dashboard/NewsWidget.jsx
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';

const NewsWidget = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  useEffect(() => {
    loadNewsData();
  }, [selectedCategory]);
  
  const loadNewsData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getNewsFeed(selectedCategory);
      setNews(response.data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Nachrichten:', err);
      setError('Nachrichten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };
  
  // Verfügbare Nachrichtenkategorien
  const categories = [
    { id: '', name: 'Alle' },
    { id: 'technologie', name: 'Technologie' },
    { id: 'gesundheit', name: 'Gesundheit' },
    { id: 'ernährung', name: 'Ernährung' },
    { id: 'lifestyle', name: 'Lifestyle' }
  ];
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  // Formatiert Datum für Nachrichten
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Aktuelle Nachrichten</h3>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="text-xs border-gray-300 rounded-md p-1"
        >
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {news.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <Newspaper className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2">Keine Nachrichten verfügbar</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {news.map((item, index) => (
            <div key={index} className="py-3">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex group"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <span>{item.source}</span>
                    <span className="mx-1">•</span>
                    <span>{formatNewsDate(item.date)}</span>
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsWidget;