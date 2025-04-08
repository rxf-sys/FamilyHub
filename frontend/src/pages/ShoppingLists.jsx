import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Search, AlertCircle, Check } from 'lucide-react';
import { shoppingApi } from '../api/shoppingApi';

const ShoppingLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const { data } = await shoppingApi.getLists();
      setLists(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Fehler beim Laden der Einkaufslisten');
    } finally {
      setLoading(false);
    }
  };

  // Filtern der Listen basierend auf dem Suchbegriff
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Einkaufslisten</h1>
        <Link 
          to="/shopping/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Neue Liste
        </Link>
      </div>

      {/* Suchleiste */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Listen durchsuchen..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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

      {/* Ladeanzeige */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Keine Listen vorhanden */}
          {filteredLists.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Keine Einkaufslisten</h3>
              <p className="mt-1 text-sm text-gray-500">
                Erstellen Sie Ihre erste Einkaufsliste, um loszulegen.
              </p>
              <div className="mt-6">
                <Link
                  to="/shopping/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Neue Liste erstellen
                </Link>
              </div>
            </div>
          )}

          {/* Listenansicht */}
          {filteredLists.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredLists.map((list) => (
                  <li key={list._id}>
                    <Link to={`/shopping/${list._id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {list.name}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            {list.isUrgent && (
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Dringend
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {list.items.length} Artikel
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              {list.items.filter(item => item.completed).length} erledigt
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              Aktualisiert am {new Date(list.updatedAt).toLocaleDateString('de-DE')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShoppingLists;