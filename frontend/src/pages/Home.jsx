import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  ShoppingCart, 
  Utensils, 
  Pill, 
  FileText, 
  CheckCircle 
} from 'lucide-react';

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="p-3 bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      {/* Navigation */}
      <header className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link to="/" className="text-xl font-bold text-blue-600">
                FamilyHub
              </Link>
            </div>
            <div className="flex items-center md:ml-12">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-base font-medium text-gray-500 hover:text-gray-900"
                  >
                    Anmelden
                  </Link>
                  <Link
                    to="/register"
                    className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero-Bereich */}
        <div className="relative">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-5xl lg:text-6xl">
                <span className="block text-gray-900">Einfacher organisiert.</span>
                <span className="block text-blue-600">Mehr Zeit für die Familie.</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-gray-500 sm:max-w-3xl">
                FamilyHub ist die All-in-One Lösung für moderne Familien, die ihren Alltag effizient und stressfrei organisieren möchten.
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    to="/register"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8"
                  >
                    Kostenlos starten
                  </Link>
                  <a
                    href="#features"
                    className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 sm:px-8"
                  >
                    Mehr erfahren
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-16 bg-gray-50 overflow-hidden lg:py-24">
          <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="relative">
              <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Alles, was Ihre Familie braucht
              </h2>
              <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
                FamilyHub vereint alle wichtigen Familienfunktionen in einer übersichtlichen App.
              </p>
            </div>

            <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="mt-10 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
                <Feature
                  icon={<Calendar className="h-6 w-6 text-blue-600" />}
                  title="Familienkalender"
                  description="Teilen Sie Termine mit allen Familienmitgliedern und behalten Sie den Überblick über alle Aktivitäten."
                />
                <Feature
                  icon={<ShoppingCart className="h-6 w-6 text-blue-600" />}
                  title="Einkaufsplaner"
                  description="Erstellen und teilen Sie Einkaufslisten und organisieren Sie Ihren Vorrat effizient."
                />
                <Feature
                  icon={<Utensils className="h-6 w-6 text-blue-600" />}
                  title="Mahlzeitenplaner"
                  description="Planen Sie Ihre Mahlzeiten für die Woche und erstellen Sie automatisch Einkaufslisten."
                />
                <Feature
                  icon={<FileText className="h-6 w-6 text-blue-600" />}
                  title="Dokumentenorganisator"
                  description="Bewahren Sie wichtige Dokumente sicher auf und greifen Sie jederzeit darauf zu."
                />
              </div>
            </div>

            <div className="relative mt-12 sm:mt-16 lg:mt-24">
              <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div className="lg:col-start-2">
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl">
                    Einfacher organisiert. Mehr Zeit für das Wesentliche.
                  </h3>
                  <p className="mt-3 text-lg text-gray-500">
                    FamilyHub wurde entwickelt, um den Familienalltag zu erleichtern und Stress zu reduzieren. 
                    Alle wichtigen Informationen an einem Ort, zugänglich für die ganze Familie.
                  </p>

                  <dl className="mt-10 space-y-10">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <dt className="text-lg leading-6 font-medium text-gray-900">
                          Für die ganze Familie
                        </dt>
                        <dd className="mt-2 text-base text-gray-500">
                          Teilen Sie Informationen mit allen Familienmitgliedern und koordinieren Sie Ihren Alltag gemeinsam.
                        </dd>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <dt className="text-lg leading-6 font-medium text-gray-900">
                          Einfach zu bedienen
                        </dt>
                        <dd className="mt-2 text-base text-gray-500">
                          Intuitive Benutzeroberfläche, die von allen Familienmitgliedern leicht zu verstehen ist.
                        </dd>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <dt className="text-lg leading-6 font-medium text-gray-900">
                          Sicher und privat
                        </dt>
                        <dd className="mt-2 text-base text-gray-500">
                          Ihre Familiendaten werden sicher gespeichert und sind nur für autorisierte Familienmitglieder zugänglich.
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                  <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                    <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                      <span className="sr-only">Watch our video to learn more</span>
                      <div className="w-full h-64 bg-blue-100 flex items-center justify-center text-blue-500">
                        <span className="text-xl font-medium">FamilyHub Dashboard Vorschau</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Bereit, Ihren Familienalltag zu vereinfachen?</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-blue-100">
              Starten Sie noch heute kostenlos mit FamilyHub und entdecken Sie, wie einfach Familienorganisation sein kann.
            </p>
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
            >
              Kostenlos registrieren
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Über uns
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Datenschutz
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Nutzungsbedingungen
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                Kontakt
              </a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} FamilyHub. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;