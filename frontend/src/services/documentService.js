// src/services/documentService.js

// Demo-Daten für Dokumente
const documents = [
    {
      id: '1',
      name: 'Mietvertrag',
      description: 'Aktueller Mietvertrag für unsere Wohnung',
      category: 'Verträge',
      fileName: 'mietvertrag.pdf',
      fileType: 'application/pdf',
      fileSize: 1250000, // 1.25 MB
      uploadDate: '2024-03-15T14:25:00Z',
      expiryDate: null,
      isShared: true,
      tags: ['Wohnung', 'Wichtig']
    },
    {
      id: '2',
      name: 'Versicherungspolice',
      description: 'Hausratversicherung',
      category: 'Versicherungen',
      fileName: 'hausrat_police.pdf',
      fileType: 'application/pdf',
      fileSize: 950000, // 950 KB
      uploadDate: '2024-02-20T10:15:00Z',
      expiryDate: '2025-03-01T00:00:00Z',
      isShared: true,
      tags: ['Versicherung', 'Jährlich']
    },
    {
      id: '3',
      name: 'Personalausweis',
      description: 'Scan des Personalausweises',
      category: 'Persönliche Dokumente',
      fileName: 'ausweis.jpg',
      fileType: 'image/jpeg',
      fileSize: 1500000, // 1.5 MB
      uploadDate: '2023-11-05T09:30:00Z',
      expiryDate: '2028-10-31T00:00:00Z',
      isShared: false,
      tags: ['Ausweis', 'Wichtig']
    }
  ];
  
  // Vorhandene Dokumentenkategorien
  const categories = [
    'Verträge',
    'Versicherungen',
    'Persönliche Dokumente',
    'Finanzen',
    'Gesundheit',
    'Bildung',
    'Haus & Wohnung',
    'Fahrzeuge',
    'Sonstiges'
  ];
  
  export const documentService = {
    // Dokumente
    getDocuments: (category = null, searchTerm = null) => {
      let filteredDocs = [...documents];
      
      // Nach Kategorie filtern
      if (category && category !== 'Alle') {
        filteredDocs = filteredDocs.filter(doc => doc.category === category);
      }
      
      // Nach Suchbegriff filtern
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => {
          return (
            doc.name.toLowerCase().includes(term) ||
            doc.description.toLowerCase().includes(term) ||
            doc.tags.some(tag => tag.toLowerCase().includes(term))
          );
        });
      }
      
      return Promise.resolve(filteredDocs);
    },
    
    getDocumentById: (id) => {
      const document = documents.find(doc => doc.id === id);
      if (document) {
        return Promise.resolve(document);
      }
      return Promise.reject(new Error('Dokument nicht gefunden'));
    },
    
    createDocument: (documentData) => {
      const newDocument = {
        ...documentData,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString(),
        tags: documentData.tags || []
      };
      documents.push(newDocument);
      return Promise.resolve(newDocument);
    },
    
    updateDocument: (id, documentData) => {
      const index = documents.findIndex(doc => doc.id === id);
      if (index !== -1) {
        documents[index] = { ...documents[index], ...documentData };
        return Promise.resolve(documents[index]);
      }
      return Promise.reject(new Error('Dokument nicht gefunden'));
    },
    
    deleteDocument: (id) => {
      const index = documents.findIndex(doc => doc.id === id);
      if (index !== -1) {
        const deletedDocument = documents.splice(index, 1)[0];
        return Promise.resolve(deletedDocument);
      }
      return Promise.reject(new Error('Dokument nicht gefunden'));
    },
    
    // Kategorien
    getCategories: () => {
      return Promise.resolve(categories);
    },
    
    // Bald ablaufende Dokumente abrufen
    getExpiringDocuments: (days = 30) => {
      const today = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(today.getDate() + days);
      
      const expiringDocs = documents.filter(doc => {
        if (!doc.expiryDate) return false;
        
        const docExpiryDate = new Date(doc.expiryDate);
        return docExpiryDate >= today && docExpiryDate <= expiryDate;
      });
      
      return Promise.resolve(expiringDocs);
    },
    
    // Dokument-Datei abrufen (Simulation)
    downloadDocument: (id) => {
      const document = documents.find(doc => doc.id === id);
      if (!document) {
        return Promise.reject(new Error('Dokument nicht gefunden'));
      }
      
      // In einer echten App würde hier die Datei heruntergeladen werden
      console.log(`Dokument wird heruntergeladen: ${document.fileName}`);
      
      return Promise.resolve({
        success: true,
        message: `Dokument ${document.fileName} wurde heruntergeladen`
      });
    }
  };