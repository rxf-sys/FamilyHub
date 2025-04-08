// src/services/calendarService.js

// Da wir noch keine Backend-Integration haben, simulieren wir die Daten
const demoEvents = [
    {
      id: '1',
      title: 'Arzttermin',
      start: new Date(new Date().setHours(10, 0)),
      end: new Date(new Date().setHours(11, 30)),
      backgroundColor: '#4CAF50'
    },
    {
      id: '2',
      title: 'Elternabend',
      start: new Date(new Date().setDate(new Date().getDate() + 2)),
      allDay: true,
      backgroundColor: '#2196F3'
    },
    {
      id: '3',
      title: 'Geburtstag Lisa',
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      allDay: true,
      backgroundColor: '#9C27B0'
    }
  ];
  
  export const calendarService = {
    getEvents: () => {
      return Promise.resolve(demoEvents);
    },
    
    createEvent: (event) => {
      const newEvent = {
        ...event,
        id: Date.now().toString()
      };
      
      // In einer realen App würden Sie hier einen API-Aufruf machen
      demoEvents.push(newEvent);
      return Promise.resolve(newEvent);
    },
    
    updateEvent: (id, updatedEvent) => {
      const index = demoEvents.findIndex(event => event.id === id);
      if (index !== -1) {
        demoEvents[index] = { ...demoEvents[index], ...updatedEvent };
        return Promise.resolve(demoEvents[index]);
      }
      return Promise.reject(new Error('Event nicht gefunden'));
    },
    
    deleteEvent: (id) => {
      const index = demoEvents.findIndex(event => event.id === id);
      if (index !== -1) {
        const deletedEvent = demoEvents.splice(index, 1)[0];
        return Promise.resolve(deletedEvent);
      }
      return Promise.reject(new Error('Event nicht gefunden'));
    }
  };