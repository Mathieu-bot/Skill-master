const express = require('express');
const router = express.Router();
const { processVoiceInput, getHistory, saveHistory } = require('../controllers/voice.controller');
const authMiddleware = require('../middlewares/auth');

// Route pour traiter l'entrée vocale
router.post('/process', authMiddleware, processVoiceInput);

// Route pour récupérer l'historique des conversations
router.get('/history', authMiddleware, getHistory);

// Route pour sauvegarder l'historique des conversations
router.post('/save-history', authMiddleware, saveHistory);

module.exports = router;