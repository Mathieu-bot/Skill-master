const errorHandler = (err, req, res, next) => {
    console.error('Erreur:', err);

    if (err.name === 'SequelizeValidationError') {
        return res.status(400).json({
            success: false,
            error: 'Données invalides',
            details: err.errors.map(e => ({
                field: e.path,
                message: e.message
            }))
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            success: false,
            error: err.code === 'LIMIT_FILE_SIZE' 
                ? 'Fichier trop volumineux'
                : 'Erreur lors du téléchargement du fichier'
        });
    }

    res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler; 