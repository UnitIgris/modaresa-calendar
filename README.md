# README - Projet Frontend et API ModaResa

Ce projet est divisé en deux parties : le frontend et l'API. Le frontend est conçu pour être exécuté localement sur le port 3000, tandis que l'API est hébergée localement également.

## Frontend

### Configuration requise
- Node.js (v16.x ou ultérieur)
- npm (v6.x ou ultérieur)

### Installation
1. Clonez ce dépôt.
2. Accédez au répertoire du frontend : `cd frontend`.
3. Installez les dépendances : `npm install`.

### Exécution
- Pour lancer le frontend localement, exécutez la commande suivante : `npm run dev`.
- Accédez à l'application dans votre navigateur en visitant `http://localhost:3000`.

## API

### Configuration requise
- Node.js (v14.x ou ultérieur)
- npm (v8.x ou ultérieur)

### Installation
1. Accédez au répertoire de l'API : `cd api`.
2. Installez les dépendances : `npm install`.
3. Accédez au répertoire front : `cd front`.
4. Installez les dépendances : `npm install`.

### Exécution
- Pour lancer l'API localement, exécutez la commande suivante : `npm run dev`.
- Pour lancer le front localement, exécutez la commande suivante : `npm run start`.
- L'application sera disponible à l'adresse `http://localhost:PORT`, où `PORT` est le port spécifié dans le terminal.

### Base de données
La base de données est hébergée sur un serveur Ubuntu AWS. Assurez-vous d'avoir le fichier `api/.env`.

### Cross-Origin Resource Sharing (CORS)
Les URL pour le Cross-Origin Resource Sharing (CORS) peuvent nécessiter des ajustements en fonction de l'environnement de déploiement. 

---

Assurez-vous que les deux parties de l'application sont en cours d'exécution pour profiter pleinement de toutes les fonctionnalités.
