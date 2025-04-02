// /home/tafita/RealHack/backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        console.log('Headers reçus:', req.headers);
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé à accéder à cette route'
            });
        }

        try {
            console.log('Token reçu:', token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token décodé:', decoded);
            req.user = await User.findByPk(decoded.id);
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Token non valide'
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};

module.exports = authMiddleware;