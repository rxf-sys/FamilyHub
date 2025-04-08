// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings,
  ChevronDown,
  Bell
} from 'lucide-react';
import GlobalSearch from '../GlobalSearch';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Abmeldefehler:', error);
    }
  };

  return (
    <nav className="bg-white shadow z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                FamilyHub
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Desktop Navigation Links */}
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Kalender
              </Link>
              <Link
                to="/shopping"
                className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Einkaufen
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Globale Suche */}
            <GlobalSearch />
            
            {/* Benachrichtigungen */}
            <div className="relative">
              <button
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={toggleNotifications}
              >
                <span className="sr-only">Benachrichtigungen anzeigen</span>
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                    3
                  </span>
                </div>
              </button>
              
              {/* Benachrichtigungsmenü */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Benachrichtigungen</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {/* Beispielbenachrichtigungen - später durch Backend-Daten ersetzen */}
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Arzttermin morgen</p>
                      <p className="text-xs text-gray-500">Erinnerung an Ihren Termin morgen um 14:30 Uhr</p>
                      <p className="text-xs text-gray-400 mt-1">Vor 5 Minuten</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Neue Einkaufsliste geteilt</p>
                      <p className="text-xs text-gray-500">Anna hat die Liste "Wochenende" mit Ihnen geteilt</p>
                      <p className="text-xs text-gray-400 mt-1">Vor 30 Minuten</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">Medikament bald leer</p>
                      <p className="text-xs text-gray-500">Vitamin D wird bald aufgebraucht. Denken Sie an Nachschub.</p>
                      <p className="text-xs text-gray-400 mt-1">Vor 2 Stunden</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-center border-t border-gray-200">
                    <Link to="/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                      Alle Benachrichtigungen anzeigen
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            {currentUser ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleProfileMenu}
                  >
                    <span className="sr-only">Benutzermenü öffnen</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                      {currentUser.firstName ? currentUser.firstName.charAt(0) : ''}
                      {currentUser.lastName ? currentUser.lastName.charAt(0) : ''}
                    </div>
                    <span className="ml-2 text-gray-700 flex items-center">
                      {currentUser.firstName} {currentUser.lastName}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                  </button>
                </div>
                {isProfileMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Mein Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Einstellungen
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Menü öffnen</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/calendar"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Kalender
            </Link>
            <Link
              to="/shopping"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Einkaufen
            </Link>
            <Link
              to="/meals"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Mahlzeiten
            </Link>
            <Link
              to="/medications"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Medikamente
            </Link>
            <Link
              to="/documents"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Dokumente
            </Link>
          </div>
          {currentUser ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                    {currentUser.firstName ? currentUser.firstName.charAt(0) : ''}
                    {currentUser.lastName ? currentUser.lastName.charAt(0) : ''}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  onClick={toggleNotifications}
                  className="ml-auto p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Mein Profil
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Einstellungen
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Abmelden
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Registrieren
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;