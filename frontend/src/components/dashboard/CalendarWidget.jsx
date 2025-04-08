// src/components/dashboard/CalendarWidget.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { de } from 'date-fns/locale';

const CalendarWidget = ({ events = [] }) => {
  // Formate das Datum basierend darauf, ob es heute, morgen oder später ist
  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Heute, ${format(date, 'HH:mm', { locale: de })} Uhr`;
    } else if (isTomorrow(date)) {
      return `Morgen, ${format(date, 'HH:mm', { locale: de })} Uhr`;
    } else {
      return format(date, 'EEEE, d. MMMM, HH:mm', { locale: de }) + ' Uhr';
    }
  };
  
  // Bestimme die Farbe für den Event-Typ
  const getEventColor = (event) => {
    // Prüfen, ob eine benutzerdefinierte Farbe vorhanden ist
    if (event.color) return event.color;
    
    // Ansonsten Standardfarben basierend auf bestimmten Schlüsselwörtern vergeben
    const title = event.title.toLowerCase();
    if (title.includes('arzt') || title.includes('termin')) {
      return 'bg-blue-500';
    } else if (title.includes('geburtstag')) {
      return 'bg-pink-500';
    } else if (title.includes('schule') || title.includes('eltern')) {
      return 'bg-green-500';
    } else if (title.includes('frist') || title.includes('deadline')) {
      return 'bg-red-500';
    } else {
      return 'bg-purple-500';
    }
  };
  
  return (
    <div className="space-y-2">
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">Keine anstehenden Termine</p>
        </div>
      ) : (
        <>
          {events.map(event => (
            <div key={event._id || event.id} className="flex items-center p-2 rounded hover:bg-gray-50">
              <div className={`w-2 h-10 rounded-full mr-3 ${getEventColor(event)}`}></div>
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
                <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatEventDate(event.start)}
                  </span>
                  {event.location && (
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Link to="/calendar" className="block mt-4 text-blue-600 text-sm font-medium hover:text-blue-800">
            Alle Termine anzeigen
          </Link>
        </>
      )}
    </div>
  );
};

export default CalendarWidget;