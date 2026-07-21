# Image Linux contenant précisément Node.js 18.18.0
FROM node:18.18.0

# Dossier de travail à l’intérieur du conteneur
WORKDIR /app

# Copie d’abord les fichiers qui décrivent les dépendances
COPY package.json package-lock.json ./

# Installation propre des dépendances dans Linux
RUN npm ci

# Copie du reste du projet dans le conteneur
COPY . .

# Construction de la partie Vite dans le dossier dist
RUN npm run build

# Documentation des ports susceptibles d’être utilisés
EXPOSE 5001
EXPOSE 5173

# Commande lancée par défaut au démarrage
CMD ["npm", "run", "start"]