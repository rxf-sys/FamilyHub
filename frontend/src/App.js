// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/layout/MainLayout';

// Öffentliche Seiten
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Geschützte Seiten - Hauptmodule
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import ShoppingLists from './pages/ShoppingLists';
import ShoppingListDetail from './pages/ShoppingListDetail';
import ShoppingListForm from './components/shopping/ShoppingListForm';
import MealPlanner from './pages/MealPlanner';
import Medications from './pages/Medications';
import Documents from './pages/Documents';

// Neue Seiten
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import FamilyManagement from './pages/FamilyManagement';

// 404 Seite
import NotFound from './pages/NotFound';

// Weitere Komponenten mit Lazy Loading für Performanceoptimierung
const MedicationForm = lazy(() => import('./components/medications/MedicationForm'));
const MedicationDetail = lazy(() => import('./components/medications/MedicationDetail'));
const DocumentForm = lazy(() => import('./components/documents/DocumentForm'));
const DocumentDetail = lazy(() => import('./components/documents/DocumentDetail'));
const RecipeForm = lazy(() => import('./components/meals/RecipeForm'));
const RecipeDetail = lazy(() => import('./components/meals/RecipeDetail'));

// Lade-Komponente für Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Öffentliche Routen */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Geschützte Routen mit MainLayout */}
            <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Kalender */}
                <Route path="/calendar" element={<Calendar />} />
                
                {/* Einkaufslisten */}
                <Route path="/shopping" element={<ShoppingLists />} />
                <Route path="/shopping/new" element={<ShoppingListForm />} />
                <Route path="/shopping/:id" element={<ShoppingListDetail />} />
                <Route path="/shopping/:id/edit" element={<ShoppingListForm />} />
                
                {/* Mahlzeitenplaner */}
                <Route path="/meals" element={<MealPlanner />} />
                <Route path="/meals/recipes/new" element={<RecipeForm />} />
                <Route path="/meals/recipes/:id" element={<RecipeDetail />} />
                <Route path="/meals/recipes/:id/edit" element={<RecipeForm />} />
                
                {/* Medikamenten-Manager */}
                <Route path="/medications" element={<Medications />} />
                <Route path="/medications/new" element={<MedicationForm />} />
                <Route path="/medications/:id" element={<MedicationDetail />} />
                <Route path="/medications/:id/edit" element={<MedicationForm />} />
                
                {/* Dokumentenorganisator */}
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/new" element={<DocumentForm />} />
                <Route path="/documents/:id" element={<DocumentDetail />} />
                <Route path="/documents/:id/edit" element={<DocumentForm />} />
                
                {/* Benutzerprofil und Einstellungen */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Familienverwaltung */}
                <Route path="/family" element={<FamilyManagement />} />
              </Route>
            </Route>
            
            {/* Fallback für nicht gefundene Seiten */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;