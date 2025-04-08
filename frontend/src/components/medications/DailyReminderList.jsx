// src/components/medications/DailyReminderList.jsx
import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Pill, Check, Calendar, Clock } from 'lucide-react';

const DailyReminderList = ({ reminders, onMarkAsTaken }) => {
  const now = new Date();
  
  // Erinnerungen nach Status gruppieren
  const upcomingReminders = reminders.filter(reminder => {
    const reminderTime = new Date(reminder.timestamp);
    return !reminder.taken && reminderTime > now;
  });
  
  const dueReminders = reminders.filter(reminder => {
    const reminderTime = new Date(reminder.timestamp);
    const pastLimit = new Date(now);
    pastLimit.setHours(pastLimit.getHours() - 6); // Bis zu 6 Stunden überfällig
    
    return !reminder.taken && reminderTime <= now && reminderTime >= pastLimit;
  });
  
  const takenReminders = reminders.filter(reminder => reminder.taken);
  
  const missedReminders = reminders.filter(reminder => {
    const reminderTime = new Date(reminder.timestamp);
    const pastLimit = new Date(now);
    pastLimit.setHours(pastLimit.getHours() - 6); // Mehr als 6 Stunden überfällig
    
    return !reminder.taken && reminderTime < pastLimit;
  });

  // Hilfsfunktion zum Rendern einer Erinnerungsgruppe
  const renderReminderGroup = (title, reminderList, status) => {
    if (reminderList.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reminderList.map(reminder => (
              <li key={reminder.id}>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`rounded-full p-1.5 mr-3 ${
                      status === 'taken' ? 'bg-green-100' : 
                      status === 'due' ? 'bg-red-100' : 
                      status === 'upcoming' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Pill className={`h-4 w-4 ${
                        status === 'taken' ? 'text-green-500' : 
                        status === 'due' ? 'text-red-500' : 
                        status === 'upcoming' ? 'text-blue-500' : 'text-gray-500'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reminder.medication}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{reminder.dosage}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {reminder.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {status !== 'taken' && (
                    <button
                      onClick={() => onMarkAsTaken(reminder)}
                      className={`px-3 py-1 text-xs font-medium rounded-md ${
                        status === 'due' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                        status === 'upcoming' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Check className="h-3 w-3 mr-1 inline" />
                      Als eingenommen markieren
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-medium text-gray-900">
          Heutige Erinnerungen - {format(now, 'EEEE, d. MMMM yyyy', { locale: de })}
        </h2>
      </div>
      
      {reminders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Pill className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Erinnerungen für heute</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sie haben heute keine geplanten Medikamente einzunehmen.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {renderReminderGroup('Aktuell fällig', dueReminders, 'due')}
          {renderReminderGroup('Später heute', upcomingReminders, 'upcoming')}
          {renderReminderGroup('Bereits eingenommen', takenReminders, 'taken')}
          {renderReminderGroup('Verpasst', missedReminders, 'missed')}
        </div>
      )}
    </div>
  );
};

export default DailyReminderList;