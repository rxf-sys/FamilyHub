const mongoose = require('mongoose');

const FamilySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Familienname ist erforderlich'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    color: {
      type: String,
      default: '#3B82F6' // Blau als Standardfarbe
    },
    shareCalendar: {
      type: Boolean,
      default: true
    },
    shareShoppingLists: {
      type: Boolean,
      default: true
    },
    shareMealPlans: {
      type: Boolean,
      default: true
    },
    shareMedications: {
      type: Boolean,
      default: false // Standardmäßig nicht teilen (Privatsphäre)
    },
    shareDocuments: {
      type: Boolean,
      default: false // Standardmäßig nicht teilen (Privatsphäre)
    }
  }
}, {
  timestamps: true
});

// Virtuelle Eigenschaft für die Anzahl der Mitglieder
FamilySchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Methode zum Hinzufügen eines Mitglieds
FamilySchema.methods.addMember = function(userId, role = 'member') {
  // Prüfen, ob das Mitglied bereits existiert
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    return false;
  }
  
  this.members.push({
    user: userId,
    role,
    joinedAt: Date.now()
  });
  
  return true;
};

// Methode zum Entfernen eines Mitglieds
FamilySchema.methods.removeMember = function(userId) {
  const initialLength = this.members.length;
  
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  
  return initialLength !== this.members.length;
};

// Methode zum Aktualisieren der Rolle eines Mitglieds
FamilySchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) {
    return false;
  }
  
  member.role = newRole;
  return true;
};

module.exports = mongoose.model('Family', FamilySchema);