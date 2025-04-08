import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Utensils, 
  Pill, 
  FileText,
  Settings,
  Users,
  Home
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  // Prüfen, ob der aktuelle Pfad mit dem Navigationspfad übereinstimmt
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
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
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} FamilyHub
        </p>
      </div>
    </div>
  );
};

export default Sidebar;