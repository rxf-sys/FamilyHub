// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock, 
  Share2, 
  Palette, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Profil-Einstellungen
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
  });
  
  // Passwort-Einstellungen
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Benachrichtigungs-Einstellungen
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    calendarReminders: true,
    shoppingListReminders: true,
    mealPlanReminders: false,
    medicationReminders: true,
    documentExpiryReminders: true
  });
  
  // Datenschutz-Einstellungen
  const [privacySettings, setPrivacySettings] = useState({
    shareCalendar: true,
    shareShoppingLists: true,
    shareMealPlans: true,
    shareMedications: false,
    shareDocuments: false
  });
  
  // Erscheinungsbild-Einstellungen
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: 'blue',
    fontSize: 'medium'
  });
  
  // Tab-Konfiguration
  const tabs = [
    {
      id: 'profile',
      name: 'Profil',
      icon: <User className="h-5 w-5" />
    },
    {
      id: 'password',
      name: 'Passwort',
      icon: <Lock className="h-5 w-5" />
    },
    {
      id: 'notifications',
      name: 'Benachrichtigungen',
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: 'privacy',
      name: 'Datenschutz',
      icon: <Share2 className="h-5 w-5" />
    },
    {
      id: 'appearance',
      name: 'Erscheinungsbild',
      icon: <Palette className="h-5 w-5" />
    }
  ];
  
  // Profil-Änderungshandler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Passwort-Änderungshandler
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Benachrichtigungs-Änderungshandler
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked
    }));
  };
  
  // Datenschutz-Änderungshandler
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prevSettings => ({
      ...prevSettings,
      [name]: checked
    }));
  };
  
  // Erscheinungsbild-Änderungshandler
  const handleAppearanceChange = (e) => {
    const { name, value } = e.target;
    setAppearanceSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };
  
  // Profil aktualisieren
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulierter API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolgreiche Aktualisierung simulieren
      console.log('Profil aktualisiert:', profileData);
      
      setSuccess('Profil erfolgreich aktualisiert');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Profils:', err);
      setError('Profil konnte nicht aktualisiert werden');
    } finally {
      setLoading(false);
    }
  };
  
  // Passwort aktualisieren
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('Das neue Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulierter API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolgreiche Aktualisierung simulieren
      console.log('Passwort aktualisiert');
      
      // Formular zurücksetzen
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccess('Passwort erfolgreich aktualisiert');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Passworts:', err);
      setError('Passwort konnte nicht aktualisiert werden');
    } finally {
      setLoading(false);
    }
  };
  
  // Benachrichtigungseinstellungen speichern
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulierter API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolgreiche Aktualisierung simulieren
      console.log('Benachrichtigungseinstellungen aktualisiert:', notificationSettings);
      
      setSuccess('Benachrichtigungseinstellungen erfolgreich gespeichert');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Fehler beim Speichern der Benachrichtigungseinstellungen:', err);
      setError('Benachrichtigungseinstellungen konnten nicht gespeichert werden');
    } finally {
      setLoading(false);
    }
  };
  
  // Datenschutzeinstellungen speichern
  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulierter API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolgreiche Aktualisierung simulieren
      console.log('Datenschutzeinstellungen aktualisiert:', privacySettings);
      
      setSuccess('Datenschutzeinstellungen erfolgreich gespeichert');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Fehler beim Speichern der Datenschutzeinstellungen:', err);
      setError('Datenschutzeinstellungen konnten nicht gespeichert werden');
    } finally {
      setLoading(false);
    }
  };
  
  // Erscheinungsbildeinstellungen speichern
  const handleSaveAppearance = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simulierter API-Aufruf
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Erfolgreiche Aktualisierung simulieren
      console.log('Erscheinungsbildeinstellungen aktualisiert:', appearanceSettings);
      
      setSuccess('Erscheinungsbildeinstellungen erfolgreich gespeichert');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Fehler beim Speichern der Erscheinungsbildeinstellungen:', err);
      setError('Erscheinungsbildeinstellungen konnten nicht gespeichert werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-gray-600">Verwalten Sie Ihre Benutzereinstellungen und Präferenzen.</p>
      </div>
      
      {/* Erfolgsmeldung */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
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
      
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Profilformular */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      Vorname
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Nachname
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-Mail-Adresse
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Wird gespeichert...' : 'Speichern'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Passwortformular */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Aktuelles Passwort
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      Neues Passwort
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Das Passwort muss mindestens 8 Zeichen lang sein.
                    </p>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Passwort bestätigen
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Wird gespeichert...' : 'Passwort ändern'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Benachrichtigungsformular */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications}>
              <div className="space-y-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">Benachrichtigungskanäle</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">E-Mail-Benachrichtigungen</label>
                        <p className="text-gray-500">Erhalten Sie wichtige Benachrichtigungen per E-Mail.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="pushNotifications"
                          name="pushNotifications"
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushNotifications" className="font-medium text-gray-700">Push-Benachrichtigungen</label>
                        <p className="text-gray-500">Erhalten Sie Benachrichtigungen direkt in Ihrem Browser.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
                
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">Erinnerungen</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="calendarReminders"
                          name="calendarReminders"
                          type="checkbox"
                          checked={notificationSettings.calendarReminders}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="calendarReminders" className="font-medium text-gray-700">Kalendererinnerungen</label>
                        <p className="text-gray-500">Erhalten Sie Erinnerungen für bevorstehende Termine.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shoppingListReminders"
                          name="shoppingListReminders"
                          type="checkbox"
                          checked={notificationSettings.shoppingListReminders}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shoppingListReminders" className="font-medium text-gray-700">Einkaufslisten-Erinnerungen</label>
                        <p className="text-gray-500">Erhalten Sie Erinnerungen für dringende Einkaufslisten.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="mealPlanReminders"
                          name="mealPlanReminders"
                          type="checkbox"
                          checked={notificationSettings.mealPlanReminders}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="mealPlanReminders" className="font-medium text-gray-700">Mahlzeitenplaner-Erinnerungen</label>
                        <p className="text-gray-500">Erhalten Sie Erinnerungen für bevorstehende Mahlzeiten.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="medicationReminders"
                          name="medicationReminders"
                          type="checkbox"
                          checked={notificationSettings.medicationReminders}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="medicationReminders" className="font-medium text-gray-700">Medikamenten-Erinnerungen</label>
                        <p className="text-gray-500">Erhalten Sie Erinnerungen für die Einnahme von Medikamenten.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="documentExpiryReminders"
                          name="documentExpiryReminders"
                          type="checkbox"
                          checked={notificationSettings.documentExpiryReminders}
                          onChange={handleNotificationChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="documentExpiryReminders" className="font-medium text-gray-700">Dokument-Ablauferinnerungen</label>
                        <p className="text-gray-500">Erhalten Sie Erinnerungen für bald ablaufende Dokumente.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Wird gespeichert...' : 'Speichern'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Datenschutzformular */}
          {activeTab === 'privacy' && (
            <form onSubmit={handleSavePrivacy}>
              <div className="space-y-6">
                <fieldset>
                  <legend className="text-base font-medium text-gray-900">Freigabepräferenzen für Familienmitglieder</legend>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shareCalendar"
                          name="shareCalendar"
                          type="checkbox"
                          checked={privacySettings.shareCalendar}
                          onChange={handlePrivacyChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareCalendar" className="font-medium text-gray-700">Kalender teilen</label>
                        <p className="text-gray-500">Ihre Kalendertermine mit Familienmitgliedern teilen.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shareShoppingLists"
                          name="shareShoppingLists"
                          type="checkbox"
                          checked={privacySettings.shareShoppingLists}
                          onChange={handlePrivacyChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareShoppingLists" className="font-medium text-gray-700">Einkaufslisten teilen</label>
                        <p className="text-gray-500">Ihre Einkaufslisten mit Familienmitgliedern teilen.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shareMealPlans"
                          name="shareMealPlans"
                          type="checkbox"
                          checked={privacySettings.shareMealPlans}
                          onChange={handlePrivacyChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareMealPlans" className="font-medium text-gray-700">Mahlzeitenpläne teilen</label>
                        <p className="text-gray-500">Ihre Mahlzeitenpläne mit Familienmitgliedern teilen.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shareMedications"
                          name="shareMedications"
                          type="checkbox"
                          checked={privacySettings.shareMedications}
                          onChange={handlePrivacyChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareMedications" className="font-medium text-gray-700">Medikamente teilen</label>
                        <p className="text-gray-500">Ihre Medikamentenliste mit Familienmitgliedern teilen.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="shareDocuments"
                          name="shareDocuments"
                          type="checkbox"
                          checked={privacySettings.shareDocuments}
                          onChange={handlePrivacyChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareDocuments" className="font-medium text-gray-700">Dokumente teilen</label>
                        <p className="text-gray-500">Ihre Dokumente mit Familienmitgliedern teilen.</p>
                      </div>
                    </div>
                  </div>
                </fieldset>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Wird gespeichert...' : 'Speichern'}
                  </button>
                </div>
              </div>
            </form>
          )}
          
          {/* Erscheinungsbildformular */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveAppearance}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                    Farbdesign
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={appearanceSettings.theme}
                    onChange={handleAppearanceChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="light">Hell</option>
                    <option value="dark">Dunkel</option>
                    <option value="system">Systemeinstellung</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                    Primärfarbe
                  </label>
                  <select
                    id="primaryColor"
                    name="primaryColor"
                    value={appearanceSettings.primaryColor}
                    onChange={handleAppearanceChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="blue">Blau</option>
                    <option value="green">Grün</option>
                    <option value="red">Rot</option>
                    <option value="purple">Lila</option>
                    <option value="pink">Rosa</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">
                    Schriftgröße
                  </label>
                  <select
                    id="fontSize"
                    name="fontSize"
                    value={appearanceSettings.fontSize}
                    onChange={handleAppearanceChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="small">Klein</option>
                    <option value="medium">Mittel</option>
                    <option value="large">Groß</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {loading ? 'Wird gespeichert...' : 'Speichern'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;