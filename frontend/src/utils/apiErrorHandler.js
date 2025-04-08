// src/utils/apiErrorHandler.js

/**
 * Standardisierter API-Fehlerhandler
 * 
 * @param {Error} error - Der abgefangene Fehler
 * @param {string} fallbackMessage - Fallback-Fehlermeldung, falls keine spezifische gefunden wird
 * @returns {string} - Benutzerfreundliche Fehlermeldung
 */
export const handleApiError = (error, fallbackMessage = 'Ein unerwarteter Fehler ist aufgetreten') => {
    // Prüfen, ob es sich um eine Antwort vom Server handelt
    if (error.response) {
      // Der Server hat mit einem Statuscode außerhalb von 2xx geantwortet
      const { data, status } = error.response;
      
      // Spezifische Status-Fehlerbehandlung
      switch (status) {
        case 400:
          return data.message || 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
        case 401:
          return 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.';
        case 403:
          return 'Sie haben keine Berechtigung für diese Aktion.';
        case 404:
          return data.message || 'Die angeforderte Ressource wurde nicht gefunden.';
        case 422:
          // Validierungsfehler, die mehrere Felder betreffen können
          if (data.errors && Array.isArray(data.errors)) {
            return data.errors.join(', ');
          }
          return data.message || 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.';
        case 429:
          return 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        default:
          return data.message || fallbackMessage;
      }
    } else if (error.request) {
      // Die Anfrage wurde gesendet, aber es kam keine Antwort
      return 'Keine Antwort vom Server. Bitte überprüfen Sie Ihre Internetverbindung.';
    } else {
      // Ein Fehler ist während der Anfrageerstellung aufgetreten
      return error.message || fallbackMessage;
    }
  };
  
  /**
   * Logger für API-Fehler (kann mit einem realen Logging-Service verbunden werden)
   * 
   * @param {Error} error - Der abgefangene Fehler
   * @param {string} context - Kontext, in dem der Fehler aufgetreten ist
   */
  export const logApiError = (error, context = '') => {
    const errorInfo = {
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    };
    
    // Response-Daten hinzufügen, falls vorhanden
    if (error.response) {
      errorInfo.status = error.response.status;
      errorInfo.data = error.response.data;
      errorInfo.headers = error.response.headers;
    }
    
    // In Entwicklungsumgebung in die Konsole loggen
    console.error('API-Fehler:', errorInfo);
    
    // In Produktionsumgebung könnte hier ein richtiger Logging-Service verwendet werden
    // z.B. Sentry, LogRocket, etc.
  };
  
  /**
   * Kombinierter Error-Handler für API-Aufrufe
   * 
   * @param {Error} error - Der abgefangene Fehler
   * @param {string} context - Kontext, in dem der Fehler aufgetreten ist
   * @param {string} fallbackMessage - Fallback-Fehlermeldung
   * @returns {string} - Benutzerfreundliche Fehlermeldung
   */
  export const processApiError = (error, context, fallbackMessage) => {
    logApiError(error, context);
    return handleApiError(error, fallbackMessage);
  };
  
  export default {
    handleApiError,
    logApiError,
    processApiError
  };