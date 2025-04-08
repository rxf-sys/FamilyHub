import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, ShoppingCart, Utensils, Pill, FileText, Sun, Cloud, Umbrella } from 'lucide-react';

// Widget-Komponente
const Widget = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <span className="text-blue-600">{icon}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

// Wetter-Widget
const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 21,
    condition: 'sunny',
    location: 'Berlin'
  });
  
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case 'sunny':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case 'rainy':
        return <Umbrella className="h-12 w-12 text-blue-400" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-3xl font-bold">{weather.temperature}°C</p>
        <p className="text-gray-600 capitalize">{weather.condition}</p>
        <p className="text-sm text-gray-500">{weather.location}</p>
      </div>
      <div>
        {getWeatherIcon()}
      </div>
    </div>
  );
};

// Kalender-Widget
const CalendarWidget = () => {
  const upcomingEvents = [
    { id: 1, title: 'Arzttermin', date: '2025-04-08 14:30', type: 'appointment' },
    { id: 2, title: 'Geburtstag Max', date: '2025-04-10', type: 'birthday' },
    { id: 3, title: 'Elternabend', date: '2025-04-15 18:00', type: 'school' }
  ];
  
  return (
    <div className="space-y-2">
      {upcomingEvents.map(event => (
        <div key={event.id} className="flex items-center p-2 rounded hover:bg-gray-50">
          <div className={`w-2 h-10 rounded-full mr-3 ${
            event.type === 'appointment' ? 'bg-blue-500' : 
            event.type === 'birthday' ? 'bg-pink-500' : 'bg-green-500'
          }`}></div>
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(',', ' -')}
            </p>
          </div>
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm font-medium">Alle Termine anzeigen</button>
    </div>
  );
};

// Einkaufslisten-Widget
const ShoppingWidget = () => {
  const shoppingLists = [
    { id: 1, name: 'Wocheneinkauf', items: 12, urgent: false },
    { id: 2, name: 'Geburtstagsfeier', items: 8, urgent: true },
  ];
  
  return (
    <div className="space-y-3">
      {shoppingLists.map(list => (
        <div key={list.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div>
            <p className="font-medium">{list.name}</p>
            <p className="text-sm text-gray-500">{list.items} Artikel</p>
          </div>
          {list.urgent && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Dringend
            </span>
          )}
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm font-medium">Neue Liste erstellen</button>
    </div>
  );
};

// Mahlzeiten-Widget
const MealsWidget = () => {
  const today = new Date();
  const meals = [
    { id: 1, title: 'Frühstück', meal: 'Müsli mit Obst', time: '08:00' },
    { id: 2, title: 'Mittagessen', meal: 'Nudeln mit Tomatensauce', time: '13:00' },
    { id: 3, title: 'Abendessen', meal: 'Gemüsesuppe mit Brot', time: '19:00' },
  ];
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">
        {today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>
      {meals.map(meal => (
        <div key={meal.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div>
            <p className="font-medium">{meal.title}</p>
            <p className="text-sm">{meal.meal}</p>
          </div>
          <span className="text-sm text-gray-500">{meal.time}</span>
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm font-medium">Zum Wochenplan</button>
    </div>
  );
};

// Medikamenten-Widget
const MedicationsWidget = () => {
  const medications = [
    { id: 1, name: 'Vitamin D', dosage: '1 Tablette', time: '08:00', taken: false },
    { id: 2, name: 'Allergiemittel', dosage: '10ml', time: '20:00', taken: true },
  ];
  
  return (
    <div className="space-y-3">
      {medications.map(med => (
        <div key={med.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={med.taken} 
              readOnly
              className="h-4 w-4 text-blue-600 rounded" 
            />
            <div className="ml-3">
              <p className="font-medium">{med.name}</p>
              <p className="text-sm text-gray-500">{med.dosage} - {med.time}</p>
            </div>
          </div>
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm font-medium">Alle Medikamente anzeigen</button>
    </div>
  );
};

// Dokumente-Widget
const DocumentsWidget = () => {
  const recentDocuments = [
    { id: 1, name: 'Versicherungspolice.pdf', date: '2025-04-02', type: 'pdf' },
    { id: 2, name: 'Mietvertrag.docx', date: '2025-03-28', type: 'doc' },
  ];
  
  return (
    <div className="space-y-3">
      {recentDocuments.map(doc => (
        <div key={doc.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
          <div className="flex items-center">
            <div className={`p-1 rounded ${
              doc.type === 'pdf' ? 'bg-red-100' : 
              doc.type === 'doc' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <FileText className="h-4 w-4 text-gray-700" />
            </div>
            <div className="ml-3">
              <p className="font-medium">{doc.name}</p>
              <p className="text-sm text-gray-500">{new Date(doc.date).toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>
      ))}
      <button className="mt-2 text-blue-600 text-sm font-medium">Alle Dokumente anzeigen</button>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {currentUser?.firstName || 'Benutzer'}!
        </h1>
        <p className="text-gray-600">Hier ist eine Übersicht Ihrer aktuellen Aktivitäten und Aufgaben.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wetter-Widget */}
        <Widget title="Aktuelles Wetter" icon={<Sun className="h-5 w-5" />}>
          <WeatherWidget />
        </Widget>
        
        {/* Kalender-Widget */}
        <Widget title="Kommende Termine" icon={<Calendar className="h-5 w-5" />}>
          <CalendarWidget />
        </Widget>
        
        {/* Einkaufslisten-Widget */}
        <Widget title="Einkaufslisten" icon={<ShoppingCart className="h-5 w-5" />}>
          <ShoppingWidget />
        </Widget>
        
        {/* Mahlzeiten-Widget */}
        <Widget title="Heutige Mahlzeiten" icon={<Utensils className="h-5 w-5" />}>
          <MealsWidget />
        </Widget>
        
        {/* Medikamenten-Widget */}
        <Widget title="Medikamente" icon={<Pill className="h-5 w-5" />}>
          <MedicationsWidget />
        </Widget>
        
        {/* Dokumente-Widget */}
        <Widget title="Neueste Dokumente" icon={<FileText className="h-5 w-5" />}>
          <DocumentsWidget />
        </Widget>
      </div>
    </div>
  );
};

export default Dashboard;