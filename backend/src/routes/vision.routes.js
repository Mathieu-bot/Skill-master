const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const visionController = require('../controllers/vision.controller');

// Configuration de multer pour gérer les fichiers en mémoire
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Seules les images sont autorisées'), false);
        }
        cb(null, true);
    }
});

// Routes protégées par authentification
router.use(auth);

// Route pour obtenir toutes les analyses de l'utilisateur
router.get('/user-analyses', visionController.getUserAnalyses);

// Route pour analyser une image
router.post('/analyze', upload.single('image'), visionController.analyzeImage);

// Route pour obtenir une analyse spécifique
router.get('/:id', visionController.getAnalysis);

module.exports = router;
