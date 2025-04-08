// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Settings 
} from 'lucide-react';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Fehler beim Abmelden:', err);
      setError('Abmeldung fehlgeschlagen');
      setLoading(false);
    }
  };
  
  const navigateToSettings = () => {
    navigate('/settings');
  };
  
  // Simulierte Statistiken für die Nutzungsübersicht
  const stats = [
    { name: 'Kalenderereignisse', value: 12 },
    { name: 'Einkaufslisten', value: 3 },
    { name: 'Mahlzeitenpläne', value: 7 },
    { name: 'Medikamenteneinträge', value: 5 },
    { name: 'Dokumente', value: 8 }
  ];
  
  // Mitgliedschaftsdatum formatieren
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mein Profil</h1>
        <p className="text-gray-600">Verwalten Sie Ihre persönlichen Informationen und sehen Sie Ihre Aktivitäten.</p>
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
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Benutzerinformationen</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Persönliche Details und Kontoeinstellungen.</p>
          </div>
          <button
            onClick={navigateToSettings}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Einstellungen
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Vollständiger Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.firstName} {currentUser.lastName}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                E-Mail-Adresse
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {currentUser.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Mitglied seit
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(currentUser.createdAt || '2024-01-01')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Nutzungsstatistiken */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Nutzungsübersicht</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Eine Zusammenfassung Ihrer Aktivitäten.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-white px-4 py-5 sm:p-6">
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.name}
                  className="bg-white overflow-hidden shadow rounded-lg border"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Abmelden-Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {loading ? 'Wird abgemeldet...' : 'Abmelden'}
        </button>
      </div>
    </div>
  );
};

export default Profile;