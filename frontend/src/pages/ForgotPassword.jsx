import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // E-Mail-Validierung
    if (!email) {
      setStatus('error');
      setMessage('Bitte geben Sie Ihre E-Mail-Adresse ein');
      return;
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }
    
    setIsSubmitting(true);
    setStatus(null);
    setMessage('');
    
    try {
      // In einer realen Anwendung würde hier ein API-Aufruf erfolgen
      // await api.post('/auth/forgot-password', { email });
      
      // Simuliere einen erfolgreichen API-Aufruf
      setTimeout(() => {
        setStatus('success');
        setMessage('Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde an Ihre E-Mail-Adresse gesendet');
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Passwort zurücksetzen
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Geben Sie Ihre E-Mail-Adresse ein, und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts
          </p>
        </div>
        
        {status === 'error' && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail-Adresse
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting || status === 'success'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Link zum Zurücksetzen senden'}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Zurück zur Anmeldung
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;