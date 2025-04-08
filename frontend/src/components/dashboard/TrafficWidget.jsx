// src/components/dashboard/TrafficWidget.jsx
import React, { useState, useEffect } from 'react';
import { Map, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';

const TrafficWidget = () => {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState({
    origin: 'Zuhause',
    destination: 'Arbeit'
  });
  
  useEffect(() => {
    loadTrafficData();
  }, [locations]);
  
  const loadTrafficData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getTrafficData(
        locations.origin,
        locations.destination
      );
      setTraffic(response.data);
      setError(null);
    } catch (err) {
      console.error('Fehler beim Laden der Verkehrsdaten:', err);
      setError('Verkehrsdaten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocations(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const getTrafficStatusIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'gut':
      case 'frei':
        return <Navigation className="h-5 w-5 text-green-500" />;
      case 'moderat':
      case 'normal':
        return <Navigation className="h-5 w-5 text-yellow-500" />;
      case 'stark':
      case 'schlecht':
        return <Navigation className="h-5 w-5 text-orange-500" />;
      case 'stau':
      case 'sehr schlecht':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Navigation className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="origin" className="block text-xs font-medium text-gray-500 mb-1">
            Start
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={locations.origin}
            onChange={handleLocationChange}
            className="w-full p-2 text-sm border border-gray-300 rounded"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="destination" className="block text-xs font-medium text-gray-500 mb-1">
            Ziel
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={locations.destination}
            onChange={handleLocationChange}
            className="w-full p-2 text-sm border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-end">
          <button 
            onClick={loadTrafficData}
            className="p-2 bg-blue-600 text-white rounded"
          >
            <Map className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {traffic && (
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center">
              {getTrafficStatusIcon(traffic.trafficCondition)}
              <span className="ml-2 font-medium">
                Von {traffic.origin} nach {traffic.destination}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center mr-4">
                <Clock className="h-4 w-4 mr-1" />
                {traffic.duration} Minuten
              </span>
              <span>
                {traffic.distance} km
              </span>
            </div>
          </div>
          
          {traffic.alternativeRoutes && traffic.alternativeRoutes.length > 0 && (
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-1">Alternative Routen:</p>
              <ul className="text-sm">
                {traffic.alternativeRoutes.map((route, index) => (
                  <li key={index} className="text-gray-600">
                    Route {index + 1}: {route.duration} Min ({route.distance} km)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrafficWidget;