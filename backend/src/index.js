const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { PATHS } = require('./config/constants');
const errorHandler = require('./middlewares/errorHandler');
const sequelize = require('./config/database');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const multer = require('multer'); // Ajout de la dépendance multer
const { initializeSocket } = require('./socket');
const { cleanupTempFiles } = require('./utils/fileUtils');
require('dotenv').config();

const app = express();

// Middlewares de sécurité et performance
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Création des dossiers nécessaires
const createRequiredDirectories = async () => {
    try {
        // Utiliser les mêmes chemins que dans constants.js
        await fs.mkdir(PATHS.UPLOAD_DIR, { recursive: true });
        await fs.mkdir(PATHS.TEMP_DIR, { recursive: true });
        await fs.mkdir(PATHS.MODEL_DIR, { recursive: true });
        console.log('✅ Dossiers créés avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de la création des dossiers:', error);
    }
};

createRequiredDirectories();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware pour gérer les erreurs multer
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Le fichier est trop volumineux (max 10MB)'
            });
        }
        return res.status(400).json({
            success: false,
            error: 'Erreur lors de l\'upload du fichier'
        });
    }
    next(err);
});

//import routes
const authRoutes = require('./routes/auth.routes');
const voiceRoutes = require('./routes/voice.routes');
const visionRoutes = require('./routes/vision.routes');

//use routes
app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/vision', visionRoutes);

// Déplacer la route welcome après les autres routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to RealHack API' });
});

// Database synchronization
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });

// Gestion des erreurs
app.use(errorHandler);

// Nettoyage périodique
setInterval(() => {
    cleanupTempFiles(PATHS.TEMP_DIR);
}, 60 * 60 * 1000); // Toutes les heures

// Start server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialiser Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
