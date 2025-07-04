FROM node:18-alpine

# Arbeitsverzeichnis festlegen
WORKDIR /app

# Abhängigkeiten vorbereiten
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Restlichen Code kopieren
COPY backend ./backend
COPY frontend ./frontend

# Port öffnen
EXPOSE 3000

# Startkommando
CMD ["node", "backend/server.js"]
