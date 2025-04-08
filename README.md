# FamilyHub Backend

Das Backend der FamilyHub-Anwendung, einer All-in-One-Plattform für Familienmanagement.

## Überblick

FamilyHub ist eine umfassende Lösung für Familienorganisation und -verwaltung. Das Backend stellt die API-Endpunkte für alle Funktionen der Anwendung bereit, darunter Benutzerverwaltung, Familienkalender, Einkaufslisten, Mahlzeitenplanung, Medikamentenverwaltung und Dokumentenorganisation.

## Funktionen

- **Authentifizierung**: Benutzerregistrierung, Login, Profilmanagement
- **Familien**: Verwaltung von Familien und Familienmitgliedern
- **Kalender**: Gemeinsamer Familienkalender mit Terminen und Erinnerungen
- **Einkaufslisten**: Erstellung und Verwaltung von Einkaufslisten
- **Mahlzeitenplaner**: Rezeptverwaltung und Mahlzeitenplanung
- **Medikamenten-Manager**: Verwaltung von Medikamenten und Einnahmeplänen
- **Dokumentenorganisator**: Sichere Speicherung und Kategorisierung von Dokumenten
- **Dashboard**: Zentrale Übersicht aller wichtigen Informationen

## Technischer Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Datenbank**: MongoDB mit Mongoose ODM
- **Authentifizierung**: JWT (JSON Web Tokens)
- **Dateiuploads**: Multer
- **Logging**: Winston
- **Validierung**: MongoDB Schema-Validierung

## Installation

### Voraussetzungen

- Node.js (v14 oder höher)
- MongoDB (v4 oder höher)
- npm oder yarn

### Schritte

1. Repository klonen:
   ```bash
   git clone https://github.com/dein-username/familyhub-backend.git
   cd familyhub-backend
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Konfigurationsdatei erstellen:
   ```bash
   cp .env.example .env
   ```

4. Umgebungsvariablen in der `.env`-Datei anpassen, besonders:
   - `MONGO_URI`: MongoDB-Verbindungsstring
   - `JWT_SECRET`: Sicherer Schlüssel für JWT
   - API-Schlüssel für externe Dienste (optional)

5. Server starten:
   ```bash
   npm run dev
   ```

Der Server läuft standardmäßig auf Port 5000 und kann über `http://localhost:5000` erreicht werden.

## API-Dokumentation

### Authentifizierung

- `POST /api/auth/register` - Neuen Benutzer registrieren
- `POST /api/auth/login` - Benutzer anmelden
- `GET /api/auth/profile` - Profilinformationen abrufen
- `PUT /api/auth/profile` - Profil aktualisieren
- `PUT /api/auth/change-password` - Passwort ändern

### Familien

- `GET /api/families` - Alle Familien des Benutzers abrufen
- `GET /api/families/:id` - Familie nach ID abrufen
- `POST /api/families` - Neue Familie erstellen
- `PUT /api/families/:id` - Familie aktualisieren
- `DELETE /api/families/:id` - Familie löschen
- `POST /api/families/:id/members` - Mitglied zur Familie hinzufügen
- `DELETE /api/families/:id/members/:memberId` - Mitglied aus Familie entfernen

### Kalender

- `GET /api/events` - Termine abrufen
- `GET /api/events/:id` - Termin nach ID abrufen
- `POST /api/events` - Neuen Termin erstellen
- `PUT /api/events/:id` - Termin aktualisieren
- `DELETE /api/events/:id` - Termin löschen

### Einkaufslisten

- `GET /api/shopping` - Alle Einkaufslisten abrufen
- `GET /api/shopping/:id` - Einkaufsliste nach ID abrufen
- `POST /api/shopping` - Neue Einkaufsliste erstellen
- `PUT /api/shopping/:id` - Einkaufsliste aktualisieren
- `DELETE /api/shopping/:id` - Einkaufsliste löschen
- `POST /api/shopping/:id/items` - Artikel zur Liste hinzufügen
- `PUT /api/shopping/:listId/items/:itemId` - Artikel aktualisieren
- `DELETE /api/shopping/:listId/items/:itemId` - Artikel entfernen

### Mahlzeiten und Rezepte

- `GET /api/meals/recipes` - Rezepte abrufen
- `GET /api/meals/recipes/:id` - Rezept nach ID abrufen
- `POST /api/meals/recipes` - Neues Rezept erstellen
- `PUT /api/meals/recipes/:id` - Rezept aktualisieren
- `DELETE /api/meals/recipes/:id` - Rezept löschen
- `GET /api/meals/plan` - Mahlzeitenplan abrufen
- `POST /api/meals/plan/meals` - Mahlzeit zum Plan hinzufügen
- `PUT /api/meals/plan/meals/:id` - Mahlzeit aktualisieren
- `DELETE /api/meals/plan/meals/:id` - Mahlzeit löschen
- `POST /api/meals/recipes/add-to-shopping-list` - Rezeptzutaten zur Einkaufsliste hinzufügen

### Medikamente

- `GET /api/medications` - Alle Medikamente abrufen
- `GET /api/medications/:id` - Medikament nach ID abrufen
- `POST /api/medications` - Neues Medikament erstellen
- `PUT /api/medications/:id` - Medikament aktualisieren
- `DELETE /api/medications/:id` - Medikament löschen
- `POST /api/medications/:id/logs` - Einnahmeprotokoll hinzufügen
- `PUT /api/medications/:id/inventory` - Bestand aktualisieren
- `GET /api/medications/low-inventory` - Medikamente mit niedrigem Bestand abrufen

### Dokumente

- `GET /api/documents` - Alle Dokumente abrufen
- `GET /api/documents/:id` - Dokument nach ID abrufen
- `POST /api/documents` - Neues Dokument hochladen
- `PUT /api/documents/:id` - Dokument aktualisieren
- `DELETE /api/documents/:id` - Dokument löschen
- `GET /api/documents/:id/download` - Dokument herunterladen

### Dashboard

- `GET /api/dashboard` - Dashboard-Daten abrufen
- `GET /api/dashboard/widgets/config` - Widget-Konfiguration abrufen
- `PUT /api/dashboard/widgets/config` - Widget-Konfiguration aktualisieren
- `GET /api/dashboard/weather` - Wetterdaten abrufen
- `GET /api/dashboard/traffic` - Verkehrsdaten abrufen
- `GET /api/dashboard/news` - Nachrichten-Feed abrufen

## Entwicklung

### Projektstruktur

```
familyhub-backend/
│
├── controllers/       # Controller für die Geschäftslogik
├── middleware/        # Express Middleware
├── models/            # Mongoose Datenmodelle
├── routes/            # API-Routen
├── utils/             # Hilfsfunktionen
├── uploads/           # Verzeichnis für Dateiuploads
├── logs/              # Log-Dateien
├── .env               # Umgebungsvariablen
└── server.js          # Server-Einstiegspunkt
```

### Verfügbare Skripte

- `npm start` - Server starten
- `npm run dev` - Server mit Nodemon für Entwicklung starten
- `npm test` - Tests ausführen
- `npm run lint` - Code-Linting durchführen

## Lizenz

MIT

## Autor

rxf-sys - FamilyHub