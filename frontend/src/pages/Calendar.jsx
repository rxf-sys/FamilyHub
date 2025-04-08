// src/pages/Calendar.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, AlertCircle } from 'lucide-react';
import { calendarService } from '../services/calendarService';
import EventModal from '../components/calendar/EventModal';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDates, setSelectedDates] = useState(null);
  
  // Lade Termine beim Mounten der Komponente
  useEffect(() => {
    loadEvents();
  }, []);
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Termine:', err);
      setError('Termine konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // Aktuelle Selektion aufheben
    
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };
  
  const handleEventClick = (clickInfo) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleSaveEvent = async (eventData) => {
    try {
      setLoading(true);
      let savedEvent;
      
      if (selectedEvent) {
        // Aktualisiere existierenden Termin
        savedEvent = await calendarService.updateEvent(selectedEvent.id, eventData);
        setEvents(events.map(e => e.id === savedEvent.id ? savedEvent : e));
      } else {
        // Erstelle neuen Termin
        const newEventData = selectedDates ? {
          ...eventData,
          start: selectedDates.start,
          end: selectedDates.end,
          allDay: selectedDates.allDay
        } : eventData;
        
        savedEvent = await calendarService.createEvent(newEventData);
        setEvents([...events, savedEvent]);
      }
      
      setShowEventModal(false);
      setSelectedEvent(null);
      setSelectedDates(null);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Speichern des Termins:', err);
      setError('Der Termin konnte nicht gespeichert werden.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Familienkalender</h1>
        <button 
          onClick={() => {
            setSelectedEvent(null);
            setSelectedDates(null);
            setShowEventModal(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Neuer Termin
        </button>
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
      
      {/* Kalender */}
      <div className="bg-white rounded-lg shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale="de"
          buttonText={{
            today: 'Heute',
            month: 'Monat',
            week: 'Woche',
            day: 'Tag'
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
        />
      </div>
      
      {/* Event-Modal */}
      <EventModal 
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
      />
    </div>
  );
};

export default Calendar;