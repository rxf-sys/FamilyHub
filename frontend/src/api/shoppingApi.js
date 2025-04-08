import api from './api';

export const shoppingApi = {
  // Alle Einkaufslisten des Benutzers abrufen
  getLists: async () => {
    try {
      const response = await api.get('/shopping');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Einkaufslisten' };
    }
  },

  // Eine einzelne Einkaufsliste abrufen
  getList: async (id) => {
    try {
      const response = await api.get(`/shopping/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Abrufen der Einkaufsliste' };
    }
  },

  // Neue Einkaufsliste erstellen
  createList: async (listData) => {
    try {
      const response = await api.post('/shopping', listData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Erstellen der Einkaufsliste' };
    }
  },

  // Einkaufsliste aktualisieren
  updateList: async (id, listData) => {
    try {
      const response = await api.put(`/shopping/${id}`, listData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren der Einkaufsliste' };
    }
  },

  // Einkaufsliste löschen
  deleteList: async (id) => {
    try {
      const response = await api.delete(`/shopping/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Löschen der Einkaufsliste' };
    }
  },

  // Artikel zu einer Einkaufsliste hinzufügen
  addItem: async (listId, itemData) => {
    try {
      const response = await api.post(`/shopping/${listId}/items`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Hinzufügen des Artikels' };
    }
  },

  // Artikel in einer Einkaufsliste aktualisieren
  updateItem: async (listId, itemId, itemData) => {
    try {
      const response = await api.put(`/shopping/${listId}/items/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Aktualisieren des Artikels' };
    }
  },

  // Artikel aus einer Einkaufsliste entfernen
  deleteItem: async (listId, itemId) => {
    try {
      const response = await api.delete(`/shopping/${listId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Entfernen des Artikels' };
    }
  },

  // Artikel als erledigt/nicht erledigt markieren
  toggleItemStatus: async (listId, itemId, completed) => {
    try {
      const response = await api.put(`/shopping/${listId}/items/${itemId}`, { completed });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Fehler beim Ändern des Artikelstatus' };
    }
  }
};