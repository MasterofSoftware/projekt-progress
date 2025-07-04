FROM node:18-alpine

WORKDIR /app

# 🟢 Kopiere package.json korrekt aus dem backend-Ordner
COPY backend/package*.json ./backend/

# 🟢 Wechsle ins Backend-Verzeichnis und installiere dort
RUN cd backend && npm install

# 🟢 Jetzt den restlichen Code kopieren
COPY backend ./backend
COPY frontend ./frontend

# 🔁 Optional: Port setzen (abhängig vom Server in backend)
EXPOSE 3000

# 🟢 Starte den Server aus dem backend
CMD ["node", "backend/server.js"]
