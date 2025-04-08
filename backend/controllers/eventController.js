// controllers/eventController.js

// Event Controller

const Event = require('../models/Event');
const User = require('../models/User');
const Family = require('../models/Family');

// Alle Termine eines Benutzers abrufen
exports.getEvents = async (req, res) => {
  try {
    const { start, end, family } = req.query;
    
    const query = {
      $or: [
        { user: req.user.id }, // Eigene Termine
        { sharedWith: req.user.id } // Mit dem Benutzer geteilte Termine
      ]
    };
    
    // Zeitraum filtern
    if (start) {
      query.start = { $gte: new Date(start) };
    }
    if (end) {
      query.end = { $lte: new Date(end) };
    }
    
    // Nach Familie filtern
    if (family) {
      query.family = family;
    }
    
    const events = await Event.find(query)
      .populate('user', 'firstName lastName')
      .sort({ start: 1 });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen der Termine',
      error: error.message
    });
  }
};

// Einen einzelnen Termin abrufen
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('user', 'firstName lastName')
      .populate('family', 'name')
      .populate('sharedWith', 'firstName lastName');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer Zugriff auf den Termin hat
    if (event.user._id.toString() !== req.user.id && 
        !event.sharedWith.some(user => user._id.toString() === req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Zugriff verweigert'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Abrufen des Termins',
      error: error.message
    });
  }
};

// Neuen Termin erstellen
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      allDay,
      location,
      color,
      family,
      reminderTime,
      recurrence,
      isShared,
      sharedWith
    } = req.body;
    
    // Prüfen, ob Familie existiert und der Benutzer Mitglied ist
    if (family) {
      const familyExists = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!familyExists) {
        return res.status(400).json({
          success: false,
          message: 'Familie nicht gefunden oder Sie sind kein Mitglied'
        });
      }
    }
    
    // Termin erstellen
    const event = await Event.create({
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      allDay: allDay || false,
      location,
      color: color || '#3B82F6',
      user: req.user.id,
      family,
      reminderTime: reminderTime || 30,
      recurrence: recurrence || { type: 'none', interval: 1 },
      isShared: isShared !== undefined ? isShared : true,
      sharedWith: sharedWith || []
    });
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Erstellen des Termins',
      error: error.message
    });
  }
};

// Termin aktualisieren
exports.updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      allDay,
      location,
      color,
      family,
      reminderTime,
      recurrence,
      isShared,
      sharedWith
    } = req.body;
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Ersteller ist
    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nur der Ersteller kann den Termin aktualisieren'
      });
    }
    
    // Wenn eine Familie angegeben wurde, prüfen, ob der Benutzer Mitglied ist
    if (family) {
      const familyExists = await Family.findOne({
        _id: family,
        'members.user': req.user.id
      });
      
      if (!familyExists) {
        return res.status(400).json({
          success: false,
          message: 'Familie nicht gefunden oder Sie sind kein Mitglied'
        });
      }
    }
    
    // Termin aktualisieren
    event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        start: start ? new Date(start) : event.start,
        end: end ? new Date(end) : event.end,
        allDay: allDay !== undefined ? allDay : event.allDay,
        location,
        color,
        family,
        reminderTime,
        recurrence,
        isShared: isShared !== undefined ? isShared : event.isShared,
        sharedWith
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Aktualisieren des Termins',
      error: error.message
    });
  }
};

// Termin löschen
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Termin nicht gefunden'
      });
    }
    
    // Prüfen, ob der Benutzer der Ersteller ist
    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nur der Ersteller kann den Termin löschen'
      });
    }
    
    await event.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Serverfehler beim Löschen des Termins',
      error: error.message
    });
  }
};