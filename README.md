# RealHack - Plateforme d'Analyse d'Images par IA

RealHack est une application web moderne qui utilise l'intelligence artificielle pour analyser des images. Elle offre des fonctionnalités avancées comme la détection de texte, l'analyse de la qualité d'image et l'extraction des couleurs dominantes.

## Fonctionnalités

- **Analyse d'images**
  - Détection de texte (OCR) en français et anglais
  - Analyse de la qualité d'image
  - Extraction des couleurs dominantes
  - Métadonnées détaillées

- **Gestion des utilisateurs**
  - Inscription et connexion
  - Réinitialisation de mot de passe
  - Tableau de bord personnalisé

- **Interface moderne**
  - Design responsive
  - Mode sombre/clair
  - Interface utilisateur intuitive

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL
- npm ou yarn

### Backend

```bash
cd backend
cp .env.example .env  # Créez et configurez votre fichier .env
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## Configuration

1. Créez une base de données PostgreSQL
2. Configurez les variables d'environnement dans le fichier `.env` :

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/realhack
JWT_SECRET=votre_secret_jwt
PORT=5000

# Frontend (si nécessaire)
VITE_API_URL=http://localhost:5000
```

## Utilisation

1. Lancez le backend et le frontend
2. Créez un compte utilisateur
3. Connectez-vous
4. Commencez à analyser vos images !

## Technologies utilisées

- **Frontend**
  - React
  - Vite
  - TailwindCSS
  - Axios

- **Backend**
  - Node.js
  - Express
  - Sequelize
  - PostgreSQL
  - Tesseract.js
  - Sharp

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

MIT
