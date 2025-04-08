// src/components/dashboard/WeatherWidget.jsx
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Umbrella } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { processApiError } from '../../utils/apiErrorHandler';

const WeatherWidget = () => {
const [weather, setWeather] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadWeatherData();
}, []);

// Wettervorhersage für kommende Tage anzeigen
const [showForecast, setShowForecast] = useState(false);
  
// Tab-Umschaltung zwischen aktuellem Wetter und Vorhersage
const toggleForecast = () => {
  setShowForecast(!showForecast);
};

const loadWeatherData = async () => {
  try {
    setLoading(true);
    // Standardmäßig Wetter für Berlin laden, später könnte die Stadt basierend auf dem Benutzerstandort eingestellt werden
    const response = await dashboardApi.getWeatherData('Berlin');
    setWeather(response.data);
    setError(null);
  } catch (err) {
    const errorMessage = processApiError(err, 'Wetterdaten laden', 'Wetterdaten konnten nicht geladen werden');
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

const getWeatherIcon = (condition) => {
  switch (condition?.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun className="h-12 w-12 text-yellow-500" />;
    case 'partly cloudy':
    case 'cloudy':
      return <Cloud className="h-12 w-12 text-gray-400" />;
    case 'rain':
    case 'rainy':
    case 'showers':
      return <CloudRain className="h-12 w-12 text-blue-400" />;
    case 'snow':
    case 'snowy':
      return <CloudSnow className="h-12 w-12 text-gray-300" />;
    case 'thunderstorm':
    case 'storm':
      return <CloudLightning className="h-12 w-12 text-purple-500" />;
    case 'windy':
      return <Wind className="h-12 w-12 text-blue-300" />;
    default:
      return <Umbrella className="h-12 w-12 text-gray-500" />;
  }
};

if (loading) {
  return (
    <div className="flex justify-center items-center h-32">
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

if (!weather) {
  return (
    <div className="p-4 text-center text-gray-500">
      <p>Keine Wetterdaten verfügbar</p>
    </div>
  );
}

return (
  <div className="space-y-4">
    {/* Tabs für aktuelles Wetter / Vorhersage */}
    <div className="flex border-b">
      <button
        className={`py-2 px-3 text-xs font-medium ${
          !showForecast
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setShowForecast(false)}
      >
        Aktuell
      </button>
      <button
        className={`py-2 px-3 text-xs font-medium ${
          showForecast
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => setShowForecast(true)}
      >
        Vorhersage
      </button>
    </div>
    
    {!showForecast ? (
      // Aktuelles Wetter
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold">{weather.current.temperature}°C</p>
          <p className="text-gray-600 capitalize">{weather.current.condition}</p>
          <p className="text-sm text-gray-500">{weather.location}</p>
          <div className="mt-2 text-xs text-gray-500">
            <span>Luftfeuchtigkeit: {weather.current.humidity}%</span>
            <span className="ml-2">Wind: {weather.current.windSpeed} km/h</span>
          </div>
        </div>
        <div>
          {getWeatherIcon(weather.current.condition)}
        </div>
      </div>
    ) : (
      // Wettervorhersage
      <div className="grid grid-cols-3 gap-2">
        {weather.forecast.map((day, index) => (
          <div key={index} className="text-center p-2 border rounded">
            <p className="text-xs font-medium">{day.day}</p>
            <div className="my-2">
              {getWeatherIcon(day.condition)}
            </div>
            <p className="text-sm font-bold">{day.high}° / {day.low}°</p>
            <p className="text-xs text-gray-500 capitalize">{day.condition}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default WeatherWidget;