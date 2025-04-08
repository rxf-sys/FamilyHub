// controllers/dashboardController.js

// Dashboard Controller

const Event = require('../models/Event');
const ShoppingList = require('../models/ShoppingList');
const Meal = require('../models/Meal');
const Medication = require('../models/Medication');
const Document = require('../models/Document');
const Family = require('../models/Family');

/**
 * Dashboard-Daten für den Benutzer abrufen
 */
exports.getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    // Parallele Anfragen für bessere Performance
    const [
      upcomingEvents,
      urgentShoppingLists,
      todaysMeals,
      medicationReminders,
      expiringDocuments,
      familyData
    ] = await Promise.all([
      // Heute und die nächsten 7 Tage Terminkalender
      Event.find({
        $or: [
          { user: req.user.id },
          { sharedWith: req.user.id }
        ],
        start: { $gte: today, $lte: weekEnd }
      })
        .sort('start')
        .limit(10)
        .populate('user', 'firstName lastName')
        .populate('family', 'name'),
      
      // Dringende Einkaufslisten
      ShoppingList.find({
        $or: [
          { createdBy: req.user.id },
          { sharedWith: req.user.id }
        ],
        isUrgent: true
      })
        .sort('-updatedAt')
        .limit(5),
      
      // Heutige Mahlzeiten
      Meal.find({
        user: req.user.id,
        date: {
          $gte: today,
          $lt: tomorrow
        }
      })
        .populate('recipe')
        .sort('type'),
      
      // Medikamente mit Erinnerungen für heute
      Medication.find({
        user: req.user.id,
        'schedules.active': true
      }),
      
      // Bald ablaufende Dokumente (nächste 30 Tage)
      Document.find({
        user: req.user.id,
        expiryDate: {
          $gte: today,
          $lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
        }
      })
        .sort('expiryDate')
        .limit(5),
      
      // Familiendaten
      Family.find({
        'members.user': req.user.id
      })
        .select('name members')
        .populate('members.user', 'firstName lastName')
    ]);
    
    // Medikamentenerinnerungen für heute filtern
    const todaysMedications = medicationReminders.filter(medication => {
      return medication.schedules.some(schedule => {
        // Heutigen Wochentag prüfen (0 = Sonntag, 1 = Montag, ...)
        const todayDayOfWeek = today.getDay();
        return schedule.active && schedule.daysOfWeek.includes(todayDayOfWeek);
      });
    });
    
    // Medikamente mit niedrigem Bestand
    const lowInventoryMedications = medicationReminders.filter(medication => {
      return medication.refillReminder && medication.remainingAmount <= medication.refillThreshold;
    });
    
    // Zusammengesetzte Dashboard-Daten
    const dashboardData = {
      events: {
        upcoming: upcomingEvents,
        today: upcomingEvents.filter(event => {
          const eventDate = new Date(event.start);
          return eventDate >= today && eventDate < tomorrow;
        })
      },
      shopping: {
        urgent: urgentShoppingLists
      },
      meals: {
        today: todaysMeals
      },
      medications: {
        today: todaysMedications,
        lowInventory: lowInventoryMedications
      },
      documents: {
        expiring: expiringDocuments
      },
      family: familyData
    };
    
    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Dashboard-Daten:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Dashboard-Daten',
      error: error.message
    });
  }
};

/**
 * Benutzerspezifische Widget-Konfiguration abrufen
 */
exports.getWidgetConfig = async (req, res) => {
  try {
    // In einer vollständigen Implementierung würden Benutzereinstellungen aus der Datenbank geladen
    // Für jetzt wird eine Standardkonfiguration zurückgegeben
    
    const widgetConfig = {
      activeWidgets: [
        'calendar',
        'weather',
        'shopping',
        'meals',
        'medications',
        'documents'
      ],
      layout: {
        calendar: { x: 0, y: 0, w: 6, h: 4 },
        weather: { x: 6, y: 0, w: 6, h: 2 },
        shopping: { x: 6, y: 2, w: 6, h: 2 },
        meals: { x: 0, y: 4, w: 4, h: 3 },
        medications: { x: 4, y: 4, w: 4, h: 3 },
        documents: { x: 8, y: 4, w: 4, h: 3 }
      }
    };
    
    res.status(200).json({
      success: true,
      data: widgetConfig
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Widget-Konfiguration:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Widget-Konfiguration',
      error: error.message
    });
  }
};

/**
 * Widget-Konfiguration aktualisieren
 */
exports.updateWidgetConfig = async (req, res) => {
  try {
    const { activeWidgets, layout } = req.body;
    
    // In einer vollständigen Implementierung würden Benutzereinstellungen in der Datenbank gespeichert
    // Für jetzt wird eine erfolgreiche Antwort mit den aktualisierten Daten zurückgegeben
    
    const updatedConfig = {
      activeWidgets: activeWidgets || [],
      layout: layout || {}
    };
    
    res.status(200).json({
      success: true,
      data: updatedConfig
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Widget-Konfiguration:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren der Widget-Konfiguration',
      error: error.message
    });
  }
};

/**
 * Wetterdaten abrufen (Beispiel für externe API-Integration)
 */
exports.getWeatherData = async (req, res) => {
  try {
    const { location } = req.query;
    
    // In einer vollständigen Implementierung würde hier eine externe Wetter-API angesprochen werden
    // Für jetzt werden Beispieldaten zurückgegeben
    
    const weatherData = {
      location: location || 'Berlin',
      current: {
        temperature: 18,
        condition: 'Teilweise bewölkt',
        humidity: 65,
        windSpeed: 12
      },
      forecast: [
        { day: 'Heute', high: 20, low: 14, condition: 'Teilweise bewölkt' },
        { day: 'Morgen', high: 22, low: 15, condition: 'Sonnig' },
        { day: 'Übermorgen', high: 19, low: 13, condition: 'Regnerisch' }
      ]
    };
    
    res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Wetterdaten:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Wetterdaten',
      error: error.message
    });
  }
};

/**
 * Verkehrsdaten abrufen (Beispiel für externe API-Integration)
 */
exports.getTrafficData = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    
    // In einer vollständigen Implementierung würde hier eine externe Verkehrs-API angesprochen werden
    // Für jetzt werden Beispieldaten zurückgegeben
    
    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Start- und Zielort sind erforderlich'
      });
    }
    
    const trafficData = {
      origin: origin,
      destination: destination,
      duration: 35, // Minuten
      distance: 15.4, // km
      trafficCondition: 'moderat',
      alternativeRoutes: [
        { 
          duration: 40, 
          distance: 17.2, 
          viaPoints: ['Hauptstraße', 'Bahnhof'] 
        },
        { 
          duration: 45, 
          distance: 14.8, 
          viaPoints: ['Autobahn', 'Innenstadt'] 
        }
      ]
    };
    
    res.status(200).json({
      success: true,
      data: trafficData
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Verkehrsdaten:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Verkehrsdaten',
      error: error.message
    });
  }
};

/**
 * Nachrichten-Feed abrufen (Beispiel für externe API-Integration)
 */
exports.getNewsFeed = async (req, res) => {
  try {
    const { category } = req.query;
    
    // In einer vollständigen Implementierung würde hier eine externe Nachrichten-API angesprochen werden
    // Für jetzt werden Beispieldaten zurückgegeben
    
    const newsItems = [
      {
        title: 'Neue Funktionen in FamilyHub verfügbar',
        summary: 'Die neueste Version von FamilyHub enthält verbesserte Kalender- und Einkaufslistenfunktionen.',
        source: 'FamilyHub Blog',
        date: new Date(),
        category: 'Technologie',
        url: 'https://example.com/news/1'
      },
      {
        title: 'Tipps für die Familienorganisation im Herbst',
        summary: 'Experten teilen Ratschläge zur effektiven Planung von Familienaktivitäten in der neuen Jahreszeit.',
        source: 'Familien-Magazin',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        category: 'Lifestyle',
        url: 'https://example.com/news/2'
      },
      {
        title: 'Neue Rezeptsammlung für schnelle Familiengerichte',
        summary: 'Entdecken Sie 50 neue Rezepte, die in unter 30 Minuten zubereitet werden können.',
        source: 'Kochbuch-Verlag',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        category: 'Ernährung',
        url: 'https://example.com/news/3'
      }
    ];
    
    // Nach Kategorie filtern, falls angegeben
    const filteredNews = category 
      ? newsItems.filter(item => item.category.toLowerCase() === category.toLowerCase())
      : newsItems;
    
    res.status(200).json({
      success: true,
      count: filteredNews.length,
      data: filteredNews
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Nachrichten-Feeds:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Nachrichten-Feeds',
      error: error.message
    });
  }
};