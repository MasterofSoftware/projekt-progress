FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
COPY frontend /app/frontend
RUN mkdir -p /app/data
EXPOSE 3000
CMD ["node", "server.js"]
