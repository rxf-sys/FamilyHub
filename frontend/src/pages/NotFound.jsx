import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-extrabold text-blue-600">404</div>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
          Seite nicht gefunden
        </h2>
        <p className="mt-2 text-base text-gray-500">
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="mt-6">
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="mr-2 h-4 w-4" />
            {isAuthenticated ? 'Zurück zum Dashboard' : 'Zurück zur Startseite'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;