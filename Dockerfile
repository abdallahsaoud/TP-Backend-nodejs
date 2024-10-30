# Étape 1 : Construire le projet
FROM node:22 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code source et compiler TypeScript
COPY . .
RUN npm run build

# Étape 2 : Exécuter l'application
FROM node:22

WORKDIR /app

# Copier uniquement les dépendances pour production
COPY package*.json ./
RUN npm install --only=production

# Copier les fichiers compilés de l'étape de build
COPY --from=build /app/dist ./dist

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/server.js"]
