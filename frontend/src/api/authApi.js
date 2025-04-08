// src/api/authApi.js

// Simulierte Authentifizierungsfunktionen für die Entwicklung
export const authApi = {
  // Benutzer registrieren
  register: async (userData) => {
    try {
      // Simuliere eine API-Antwort
      const user = { 
        id: '1', 
        firstName: userData.firstName, 
        lastName: userData.lastName, 
        email: userData.email 
      };
      const token = 'fake-jwt-token';
      
      // Token im localStorage speichern
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw { message: 'Registrierungsfehler' };
    }
  },

  // Benutzer anmelden
  login: async (credentials) => {
    try {
      // Simuliere eine API-Antwort
      const user = { 
        id: '1', 
        firstName: 'Max', 
        lastName: 'Mustermann', 
        email: credentials.email 
      };
      const token = 'fake-jwt-token';
      
      // Token im localStorage speichern
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw { message: 'Anmeldefehler' };
    }
  },

  // Benutzer abmelden
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Hilfsfunktion zum Überprüfen, ob ein Benutzer angemeldet ist
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Hilfsfunktion zum Abrufen des aktuellen Benutzers
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authApi;