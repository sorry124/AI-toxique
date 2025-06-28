# Étape 1 : image de base
FROM node:20

# 🔧 Installe Git
RUN apt-get update && apt-get install -y git

# Crée le dossier de l'app
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances en prod
RUN npm install --production

# Copie le reste du code
COPY . .

# Expose le port (optionnel)
EXPOSE 3000

# Lance le bot
CMD ["npm", "start"]
