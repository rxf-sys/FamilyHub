// src/components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Utensils, 
  Pill, 
  FileText,
  Settings,
  Users,
  Home,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import api from '../../api/api';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [families, setFamilies] = useState([]);
  const [expandedFamily, setExpandedFamily] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Prüfen, ob der aktuelle Pfad mit dem Navigationspfad übereinstimmt
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Familien des aktuellen Benutzers laden
  useEffect(() => {
    if (currentUser) {
      loadFamilies();
    }
  }, [currentUser]);
  
  const loadFamilies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/families');
      setFamilies(response.data.data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Familien:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFamilyExpansion = (familyId) => {
    if (expandedFamily === familyId) {
      setExpandedFamily(null);
    } else {
      setExpandedFamily(familyId);
    }
  };
  
  // Navigation-Items
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Kalender',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      name: 'Einkaufslisten',
      path: '/shopping',
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Mahlzeitenplaner',
      path: '/meals',
      icon: <Utensils className="w-5 h-5" />
    },
    {
      name: 'Medikamente',
      path: '/medications',
      icon: <Pill className="w-5 h-5" />
    },
    {
      name: 'Dokumente',
      path: '/documents',
      icon: <FileText className="w-5 h-5" />
    }
  ];
  
  // Verwaltungs-Items
  const adminItems = [
    {
      name: 'Familie',
      path: '/family',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Einstellungen',
      path: '/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <Home className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">FamilyHub</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {/* Hauptnavigation */}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`mr-3 ${isActivePath(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
          
          {/* Familien-Abschnitt */}
          {families.length > 0 && (
            <>
              <div className="my-4 border-t border-gray-200"></div>
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Meine Familien
              </p>
              
              {families.map(family => (
                <div key={family.id || family._id}>
                  <button
                    onClick={() => toggleFamilyExpansion(family.id || family._id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <Users className="mr-3 w-5 h-5 text-gray-500" />
                      <span>{family.name}</span>
                    </div>
                    {expandedFamily === (family.id || family._id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFamily === (family.id || family._id) && (
                    <div className="ml-8 space-y-1 mt-1">
                      <Link
                        to={`/family/${family.id || family._id}/calendar`}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                        Kalender
                      </Link>
                      <Link
                        to={`/family/${family.id || family._id}/shopping`}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <ShoppingCart className="mr-2 w-4 h-4 text-gray-500" />
                        Einkaufslisten
                      </Link>
                      <Link
                        to={`/family/${family.id || family._id}/members`}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <Users className="mr-2 w-4 h-4 text-gray-500" />
                        Mitglieder
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          
          {/* Trennlinie */}
          <div className="my-4 border-t border-gray-200"></div>
          
          {/* Verwaltungs-Items */}
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Verwaltung
          </p>
          
          {adminItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActivePath(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`mr-3 ${isActivePath(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
            {currentUser?.firstName ? currentUser.firstName.charAt(0) : ''}
            {currentUser?.lastName ? currentUser.lastName.charAt(0) : ''}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;