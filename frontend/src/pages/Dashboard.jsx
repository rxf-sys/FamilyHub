// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Settings } from 'lucide-react';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import ShoppingWidget from '../components/dashboard/ShoppingWidget';
import MealsWidget from '../components/dashboard/MealsWidget';
import MedicationsWidget from '../components/dashboard/MedicationsWidget';
import DocumentsWidget from '../components/dashboard/DocumentsWidget';
import TrafficWidget from '../components/dashboard/TrafficWidget';
import NewsWidget from '../components/dashboard/NewsWidget';
import WidgetSettingsModal from '../components/dashboard/WidgetSettingsModal';
import { dashboardApi } from '../api/dashboardApi';
import { processApiError } from '../utils/apiErrorHandler';

// Widget-Komponente
const Widget = ({ title, children, isLoading, error, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      {error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    // Begrüßung basierend auf Tageszeit
    const hours = new Date().getHours();
    let greetingText = '';
    
    if (hours < 12) {
      greetingText = 'Guten Morgen';
    } else if (hours < 18) {
      greetingText = 'Guten Tag';
    } else {
      greetingText = 'Guten Abend';
    }
    
    setGreeting(greetingText);
  }, []);

  useEffect(() => {
    loadDashboardData();
    loadWidgetConfig();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getDashboardData();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = processApiError(err, 'Dashboard-Daten laden', 'Dashboard-Daten konnten nicht geladen werden.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadWidgetConfig = async () => {
    try {
      const response = await dashboardApi.getWidgetConfig();
      setWidgetConfig(response.data);
    } catch (err) {
      processApiError(err, 'Widget-Konfiguration laden');
      // Standardkonfiguration setzen
      setWidgetConfig({
        activeWidgets: [
          'calendar',
          'weather',
          'shopping',
          'meals',
          'medications',
          'documents',
          'traffic',
          'news'
        ],
        layout: {
          calendar: { x: 0, y: 0, w: 6, h: 4 },
          weather: { x: 6, y: 0, w: 6, h: 2 },
          shopping: { x: 6, y: 2, w: 6, h: 2 },
          meals: { x: 0, y: 4, w: 4, h: 3 },
          medications: { x: 4, y: 4, w: 4, h: 3 },
          documents: { x: 8, y: 4, w: 4, h: 3 },
          traffic: { x: 0, y: 7, w: 12, h: 2 },
          news: { x: 0, y: 9, w: 12, h: 3 }
        }
      });
    }
  };
  
  const handleSaveWidgetConfig = async (updatedConfig) => {
    try {
      await dashboardApi.updateWidgetConfig(updatedConfig);
      setWidgetConfig(updatedConfig);
    } catch (err) {
      const errorMessage = processApiError(err, 'Widget-Konfiguration speichern', 'Die Widget-Konfiguration konnte nicht gespeichert werden.');
      setError(errorMessage);
    }
  };

  const isWidgetActive = (widgetName) => {
    return widgetConfig?.activeWidgets?.includes(widgetName) || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {currentUser?.firstName || 'Benutzer'}!
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Hier ist eine Übersicht Ihrer aktuellen Aktivitäten und Aufgaben.</p>
          <button 
            onClick={() => setShowSettings(true)} 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Settings className="h-4 w-4 mr-1" />
            Dashboard anpassen
          </button>
        </div>
      </div>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wetter-Widget */}
        {isWidgetActive('weather') && (
          <Widget 
            title="Aktuelles Wetter" 
            isLoading={loading} 
            error={null}
          >
            <WeatherWidget />
          </Widget>
        )}
        
        {/* Kalender-Widget */}
        {isWidgetActive('calendar') && (
          <Widget 
            title="Kommende Termine" 
            isLoading={loading} 
            error={null}
            className="lg:col-span-2"
          >
            <CalendarWidget events={dashboardData?.events?.upcoming || []} />
          </Widget>
        )}
        
        {/* Einkaufslisten-Widget */}
        {isWidgetActive('shopping') && (
          <Widget 
            title="Einkaufslisten" 
            isLoading={loading} 
            error={null}
          >
            <ShoppingWidget lists={dashboardData?.shopping?.urgent || []} />
          </Widget>
        )}
        
        {/* Mahlzeiten-Widget */}
        {isWidgetActive('meals') && (
          <Widget 
            title="Heutige Mahlzeiten" 
            isLoading={loading} 
            error={null}
          >
            <MealsWidget meals={dashboardData?.meals?.today || []} />
          </Widget>
        )}
        
        {/* Medikamenten-Widget */}
        {isWidgetActive('medications') && (
          <Widget 
            title="Medikamente" 
            isLoading={loading} 
            error={null}
          >
            <MedicationsWidget 
              medications={dashboardData?.medications?.today || []} 
              lowInventory={dashboardData?.medications?.lowInventory || []}
            />
          </Widget>
        )}
        
        {/* Dokumente-Widget */}
        {isWidgetActive('documents') && (
          <Widget 
            title="Neueste Dokumente" 
            isLoading={loading} 
            error={null}
          >
            <DocumentsWidget documents={dashboardData?.documents?.expiring || []} />
          </Widget>
        )}
        
        {/* Verkehrs-Widget */}
        {isWidgetActive('traffic') && (
          <Widget 
            title="Aktuelle Verkehrslage" 
            isLoading={loading} 
            error={null}
            className="lg:col-span-3"
          >
            <TrafficWidget />
          </Widget>
        )}
        
        {/* Nachrichten-Widget */}
        {isWidgetActive('news') && (
          <Widget 
            title="Nachrichten" 
            isLoading={loading} 
            error={null}
            className="lg:col-span-3"
          >
            <NewsWidget />
          </Widget>
        )}
      </div>
      
      {/* Widget-Einstellungen-Modal */}
      <WidgetSettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        widgetConfig={widgetConfig}
        onSave={handleSaveWidgetConfig}
      />
    </div>
  );
};

export default Dashboard;