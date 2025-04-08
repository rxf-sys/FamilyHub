// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

// Auth-Kontext erstellen
const AuthContext = createContext();

// Auth-Provider-Komponente
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beim Laden prüfen, ob der Benutzer angemeldet ist
  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  // Prüfen, ob ein Token existiert und gültig ist
  const checkLoggedInStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    try {
      // Benutzerprofilinformationen vom Backend abrufen
      const response = await api.get('/auth/profile');
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Überprüfen des Login-Status:', err);
      // Token ist ungültig oder abgelaufen, Benutzer abmelden
      localStorage.removeItem('token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setError('Sitzung abgelaufen. Bitte melde dich erneut an.');
    } finally {
      setLoading(false);
    }
  };

  // Registrierungsfunktion
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      // Token im localStorage speichern
      localStorage.setItem('token', response.data.token);
      
      // Benutzer als authentifiziert setzen
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, user: response.data.user };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Registrierungsfehler';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Anmeldefunktion
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Token im localStorage speichern
      localStorage.setItem('token', response.data.token);
      
      // Benutzer als authentifiziert setzen
      setCurrentUser(response.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, user: response.data.user };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Anmeldefehler';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Abmeldefunktion
  const logout = async () => {
    try {
      // Optional: Backend über Abmeldung informieren
      // await api.post('/auth/logout');
      
      // Token entfernen
      localStorage.removeItem('token');
      
      // Benutzer als nicht authentifiziert setzen
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Abmeldefehler:', err);
    }
  };

  // Passwort ändern
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.put('/auth/change-password', passwordData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Fehler beim Ändern des Passworts';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Profil aktualisieren
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/auth/profile', profileData);
      setCurrentUser(response.data.user);
      setLoading(false);
      return { success: true, user: response.data.user };
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Fehler beim Aktualisieren des Profils';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Werte und Funktionen, die der Kontext bereitstellt
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    changePassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook für einfachen Zugriff auf den Kontext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProviders verwendet werden');
  }
  return context;
};

export default AuthContext;