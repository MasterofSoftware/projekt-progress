FROM node:18-alpine

# Setze das Arbeitsverzeichnis direkt ins Backend
WORKDIR /app/backend

# Kopiere nur die package.json-Dateien zuerst (für besseres Layer-Caching)
COPY backend/package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere jetzt den vollständigen Backend-Code
COPY backend ./

# Kopiere auch das Frontend (ins Hauptverzeichnis z. B. für statische Dateien)
WORKDIR /app
COPY frontend ./frontend

# Port öffnen (Express hört auf 3000)
EXPOSE 3000

# Starte die App
CMD ["node", "backend/server.js"]
