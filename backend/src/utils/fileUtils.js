const fs = require('fs').promises;
const path = require('path');

const sanitizePath = (filePath) => {
    const normalized = path.normalize(filePath).replace(/^(\.\.[/\\])+/, '');
    const allowedDirs = [
        path.resolve(process.cwd(), 'uploads'),
        path.resolve(process.cwd(), 'models')
    ];
    
    const resolvedPath = path.resolve(normalized);
    if (!allowedDirs.some(dir => resolvedPath.startsWith(dir))) {
        throw new Error('Chemin de fichier non autorisé');
    }
    
    return normalized;
};

const ensureDirectoryExists = async (dirPath) => {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
};

const cleanupTempFiles = async (directory, maxAge = 24 * 60 * 60 * 1000) => {
    try {
        const files = await fs.readdir(directory);
        const now = Date.now();

        await Promise.all(files.map(async file => {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                await fs.unlink(filePath);
            }
        }));
    } catch (error) {
        console.error('Erreur lors du nettoyage des fichiers temporaires:', error);
    }
};

// Ajouter une fonction de validation des fichiers
const validateFile = async (filePath) => {
    try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            throw new Error('Le chemin ne correspond pas à un fichier');
        }
        return true;
    } catch (error) {
        throw new Error('Fichier invalide ou inaccessible');
    }
};

module.exports = {
    sanitizePath,
    ensureDirectoryExists,
    cleanupTempFiles,
    validateFile
}; 