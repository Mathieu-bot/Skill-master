# RealHack - AI Image Analysis Platform

RealHack is a modern web application that uses artificial intelligence to analyze images. It offers advanced features such as text detection, image quality analysis, and dominant color extraction.

## Features

- **Image Analysis**
  - Text detection (OCR) in French and English
  - Image quality analysis
  - Dominant color extraction
  - Detailed metadata

- **User Management**
  - Registration and login
  - Password reset
  - Personalized dashboard

- **Modern Interface**
  - Responsive design
  - Dark/Light mode
  - Intuitive user interface

## Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Backend

```bash
cd backend
cp .env.example .env  # Create and configure your .env file
npm install
npm run dev
```

### Frontend

```bash
npm install
npm run dev
```

## Configuration

1. Create a PostgreSQL database
2. Configure the environment variables in the `.env` file::

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/realhack
JWT_SECRET=votre_secret_jwt
PORT=5000

# Frontend (si nécessaire)
VITE_API_URL=http://localhost:5000
```
### Usage

1. Start the backend and frontend
2. Create a user account
3. Log in
4. Start analyzing your images!

### Technologies Used

-- Frontend

- React
- Vite
- TailwindCSS
- Axios

-- Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- Tesseract.js
- Sharp

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Licence

MIT
