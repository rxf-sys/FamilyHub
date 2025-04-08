// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Simulierte Authentifizierungsfunktionen (später mit API verbinden)
const fakeAuthApi = {
  login: (credentials) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulierte Benutzerauthentifizierung
        const user = { 
          id: '1', 
          firstName: 'Max', 
          lastName: 'Mustermann', 
          email: credentials.email 
        };
        const token = 'fake-jwt-token';
        
        // Token und Benutzer speichern
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        resolve({ success: true, user, token });
      }, 500);
    });
  },
  
  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { 
          id: '1', 
          firstName: userData.firstName, 
          lastName: userData.lastName, 
          email: userData.email 
        };
        const token = 'fake-jwt-token';
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        resolve({ success: true, user, token });
      }, 500);
    });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  }
};

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
    const storedUser = fakeAuthApi.getCurrentUser();
    const isLoggedIn = fakeAuthApi.isAuthenticated();
    
    setCurrentUser(storedUser);
    setIsAuthenticated(isLoggedIn);
    setLoading(false);
  }, []);

  // Registrierungsfunktion
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user } = await fakeAuthApi.register(userData);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, user };
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Registrierungsfehler');
      return { success: false, error: err.message || 'Registrierungsfehler' };
    }
  };

  // Anmeldefunktion
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { user } = await fakeAuthApi.login(credentials);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      
      return { success: true, user };
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Anmeldefehler');
      return { success: false, error: err.message || 'Anmeldefehler' };
    }
  };

  // Abmeldefunktion
  const logout = () => {
    fakeAuthApi.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Werte und Funktionen, die der Kontext bereitstellt
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout
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