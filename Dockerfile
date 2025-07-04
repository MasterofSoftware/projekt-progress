FROM node:18-alpine

# Backend-Ordner als Arbeitsverzeichnis
WORKDIR /app/backend

# Nur package.json kopieren, um Caching zu ermöglichen
COPY backend/package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Jetzt den gesamten Backend- und Frontend-Code kopieren
COPY backend /app/backend
COPY frontend /app/frontend

# Port des Express-Servers
EXPOSE 3000

# Startbefehl
CMD ["node", "server.js"]
