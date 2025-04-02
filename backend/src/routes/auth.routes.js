// /home/tafita/RealHack/backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Routes protégées
router.get('/me', authMiddleware, getMe);

// Route de vérification du token
router.get('/verify', authMiddleware, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;