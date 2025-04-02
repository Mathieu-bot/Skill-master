const Vision = require('../models/Vision');
const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Créer le dossier uploads s'il n'existe pas
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Fonction pour extraire les couleurs dominantes
async function extractDominantColors(imagePath) {
    try {
        const { dominant } = await sharp(imagePath)
            .stats();
        
        const palette = await sharp(imagePath)
            .resize(50, 50, { fit: 'cover' })
            .raw()
            .toBuffer({ resolveWithObject: true });

        return {
            dominant,
            palette: palette.data.toString('base64')
        };
    } catch (error) {
        console.error('Erreur lors de l\'extraction des couleurs:', error);
        return null;
    }
}

// Fonction pour estimer la qualité de l'image
async function estimateImageQuality(imagePath) {
    try {
        const metadata = await sharp(imagePath).metadata();
        const stats = await sharp(imagePath).stats();

        // Calculer un score de qualité basé sur plusieurs facteurs
        const resolution = metadata.width * metadata.height;
        const maxResolution = 4096 * 4096;
        const resolutionScore = Math.min(resolution / maxResolution, 1) * 100;

        // Score de netteté basé sur l'écart-type des valeurs de pixels
        const sharpnessScore = Math.min(
            (stats.channels[0].stdev + 
             stats.channels[1].stdev + 
             stats.channels[2].stdev) / 3 * 5,
            100
        );

        // Score final
        const qualityScore = Math.round((resolutionScore + sharpnessScore) / 2);

        return {
            score: qualityScore,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            space: metadata.space,
            hasAlpha: metadata.hasAlpha,
            channels: metadata.channels
        };
    } catch (error) {
        console.error('Erreur lors de l\'estimation de la qualité:', error);
        return null;
    }
}

exports.analyzeImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'Image manquante' 
            });
        }

        const image = req.file;

        // Vérifier le type MIME
        if (!ALLOWED_MIME_TYPES.includes(image.mimetype)) {
            return res.status(400).json({
                success: false,
                error: 'Type de fichier non supporté'
            });
        }

        // Vérifier la taille
        if (image.size > MAX_FILE_SIZE) {
            return res.status(400).json({
                success: false,
                error: 'Image trop volumineuse (max 5MB)'
            });
        }

        // Générer un nom de fichier unique
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(image.originalname)}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Sauvegarder le fichier
        await fs.promises.writeFile(filePath, image.buffer);

        // Créer l'URL relative pour accéder à l'image
        const imageUrl = `/uploads/${fileName}`;

        // Créer l'analyse dans la base de données
        const analysis = await Vision.create({
            title: req.body.title || 'Sans titre',
            imageUrl: imageUrl,
            userId: req.user.id,
            status: 'processing'
        });

        // Lancer l'analyse en arrière-plan
        processImage(analysis.id, filePath).catch(console.error);

        res.status(201).json({
            success: true,
            analysis: {
                id: analysis.id,
                title: analysis.title,
                imageUrl: analysis.imageUrl,
                status: analysis.status
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de l\'analyse de l\'image'
        });
    }
};

// Fonction pour traiter l'image en arrière-plan
async function processImage(analysisId, filePath) {
    try {
        const analysis = await Vision.findByPk(analysisId);
        if (!analysis) return;

        // OCR avec Tesseract
        const worker = await createWorker();
        await worker.loadLanguage('fra+eng');
        await worker.initialize('fra+eng');
        const { data: { text, words } } = await worker.recognize(filePath, {
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_\'"\n ',
            preserve_interword_spaces: '1'
        });
        await worker.terminate();

        // Extraire les métadonnées et la qualité
        const quality = await estimateImageQuality(filePath);
        const colors = await extractDominantColors(filePath);

        // Mettre à jour l'analyse avec les résultats
        await analysis.update({
            status: 'completed',
            results: {
                textDetection: {
                    text,
                    words: words?.map(w => ({
                        text: w.text,
                        confidence: w.confidence
                    })) || []
                },
                imageProperties: {
                    ...quality,
                    colors
                }
            }
        });
    } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', error);
        await Vision.update(
            { status: 'failed', error: error.message },
            { where: { id: analysisId } }
        );
    }
}

exports.getAnalysis = async (req, res) => {
    try {
        const analysis = await Vision.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!analysis) {
            return res.status(404).json({
                success: false,
                error: 'Analyse non trouvée'
            });
        }

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'analyse:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération de l\'analyse'
        });
    }
};

exports.getUserAnalyses = async (req, res) => {
    try {
        const analyses = await Vision.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            analyses
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des analyses:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des analyses'
        });
    }
};
