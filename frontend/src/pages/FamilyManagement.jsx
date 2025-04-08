// src/pages/FamilyManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Mail, X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const FamilyManagement = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member'
  });
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Familien beim Laden der Komponente abrufen
  useEffect(() => {
    fetchFamilies();
  }, []);
  
  // Simulierter API-Aufruf - später durch echten ersetzen
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      
      // Simulierte Antwort
      const mockFamilies = [
        {
          id: '1',
          name: 'Mustermann Familie',
          description: 'Unsere Familiengruppe',
          members: [
            { id: '1', firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com', role: 'admin' },
            { id: '2', firstName: 'Anna', lastName: 'Mustermann', email: 'anna@example.com', role: 'member' }
          ],
          createdBy: {
            id: '1',
            firstName: 'Max',
            lastName: 'Mustermann'
          }
        }
      ];
      
      setFamilies(mockFamilies);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Familien:', err);
      setError('Familien konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Formular-Änderungshandler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Einladungs-Formular-Änderungshandler
  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Familie erstellen
  const handleCreateFamily = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Simulierte Antwort
      const newFamily = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        members: [
          { 
            id: currentUser.id, 
            firstName: currentUser.firstName, 
            lastName: currentUser.lastName, 
            email: currentUser.email, 
            role: 'admin' 
          }
        ],
        createdBy: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName
        }
      };
      
      setFamilies([...families, newFamily]);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      setError(null);
      
      // Erfolgsmeldung anzeigen
      alert('Familie erfolgreich erstellt!');
    } catch (err) {
      console.error('Fehler beim Erstellen der Familie:', err);
      setError('Familie konnte nicht erstellt werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Einladung senden
  const handleSendInvite = async (e) => {
    e.preventDefault();
    
    if (!selectedFamily) return;
    
    try {
      setLoading(true);
      
      // Simulierte Antwort
      const updatedFamilies = families.map(family => {
        if (family.id === selectedFamily.id) {
          return {
            ...family,
            members: [
              ...family.members,
              { 
                id: Date.now().toString(), 
                firstName: 'Neu', 
                lastName: 'Eingeladen', 
                email: inviteData.email, 
                role: inviteData.role 
              }
            ]
          };
        }
        return family;
      });
      
      setFamilies(updatedFamilies);
      setInviteData({ email: '', role: 'member' });
      setShowInviteForm(false);
      setError(null);
      
      // Erfolgsmeldung anzeigen
      alert(`Einladung an ${inviteData.email} gesendet!`);
    } catch (err) {
      console.error('Fehler beim Senden der Einladung:', err);
      setError('Einladung konnte nicht gesendet werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mitglied entfernen
  const handleRemoveMember = async (familyId, memberId) => {
    if (!confirm('Möchten Sie dieses Mitglied wirklich entfernen?')) return;
    
    try {
      setLoading(true);
      
      // Simulierte Antwort
      const updatedFamilies = families.map(family => {
        if (family.id === familyId) {
          return {
            ...family,
            members: family.members.filter(member => member.id !== memberId)
          };
        }
        return family;
      });
      
      setFamilies(updatedFamilies);
      setError(null);
      
      // Erfolgsmeldung anzeigen
      alert('Mitglied erfolgreich entfernt!');
    } catch (err) {
      console.error('Fehler beim Entfernen des Mitglieds:', err);
      setError('Mitglied konnte nicht entfernt werden.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mitgliedsrolle ändern
  const handleChangeRole = async (familyId, memberId, newRole) => {
    try {
      setLoading(true);
      
      // Simulierte Antwort
      const updatedFamilies = families.map(family => {
        if (family.id === familyId) {
          return {
            ...family,
            members: family.members.map(member => {
              if (member.id === memberId) {
                return { ...member, role: newRole };
              }
              return member;
            })
          };
        }
        return family;
      });
      
      setFamilies(updatedFamilies);
      setError(null);
      
      // Erfolgsmeldung anzeigen
      alert('Rolle erfolgreich geändert!');
    } catch (err) {
      console.error('Fehler beim Ändern der Rolle:', err);
      setError('Rolle konnte nicht geändert werden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Familienverwaltung</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Neue Familie erstellen
        </button>
      </div>
      
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
      
      {/* Erstellungsformular */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Neue Familie erstellen</h2>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFamily}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Beschreibung
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {loading ? 'Wird erstellt...' : 'Familie erstellen'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Einladungsformular */}
      {showInviteForm && selectedFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Mitglied einladen</h2>
              <button 
                onClick={() => setShowInviteForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSendInvite}>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Familie: <span className="font-medium">{selectedFamily.name}</span>
                </p>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-Mail-Adresse
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={inviteData.email}
                    onChange={handleInviteChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rolle
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={inviteData.role}
                    onChange={handleInviteChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="member">Mitglied</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowInviteForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {loading ? 'Wird gesendet...' : 'Einladung senden'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Ladeanzeige */}
      {loading && !families.length ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Keine Familien */}
          {families.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Familien</h3>
              <p className="mt-1 text-sm text-gray-500">
                Erstellen Sie eine neue Familie, um gemeinsam zu planen.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                  Neue Familie erstellen
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Familienkarten */}
              {families.map((family) => (
                <div key={family.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{family.name}</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">{family.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFamily(family);
                        setShowInviteForm(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Mitglied einladen
                    </button>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="bg-gray-50 px-4 py-3 sm:px-6">
                      <h3 className="text-sm font-medium text-gray-900">Mitglieder</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {family.members.map((member) => (
                        <li key={member.id} className="px-4 py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                              {member.firstName.charAt(0)}
                              {member.lastName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              member.role === 'admin' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.role === 'admin' ? 'Administrator' : 'Mitglied'}
                            </span>
                            {/* Nur anzeigen, wenn der aktuelle Benutzer Admin ist */}
                            {currentUser.id === family.createdBy.id && member.id !== currentUser.id && (
                              <div className="ml-4 flex space-x-2">
                                <button 
                                  onClick={() => handleChangeRole(
                                    family.id, 
                                    member.id, 
                                    member.role === 'admin' ? 'member' : 'admin'
                                  )}
                                  className="text-blue-600 hover:text-blue-800"
                                  title={member.role === 'admin' ? 'Zum Mitglied herabstufen' : 'Zum Administrator befördern'}
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleRemoveMember(family.id, member.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Mitglied entfernen"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;