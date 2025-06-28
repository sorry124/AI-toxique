# Utilise une image Node.js officielle
FROM node:18-alpine

# Crée et positionne dans le dossier de l'app
WORKDIR /app

# Copie package.json et package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie tout le reste du code
COPY . .

# Expose le port 3000 (ou celui que tu utilises)
EXPOSE 3000

# Démarre le bot
CMD ["node", "index.js"]
