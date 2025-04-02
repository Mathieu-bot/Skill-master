const faceapi = require('@vladmandic/face-api');
const fs = require('fs').promises;
const path = require('path');
const { Canvas, Image } = require('canvas');

class ModelManager {
    constructor() {
        this.state = {
            loaded: false,
            loading: false,
            MODEL_DIR: path.join(process.cwd(), 'node_modules/@vladmandic/face-api/model')
        };
        
        // Configuration de face-api.js avec canvas
        faceapi.env.monkeyPatch({ Canvas, Image });
    }

    async load() {
        if (this.state.loading) return false;
        if (this.state.loaded) return true;

        this.state.loading = true;
        try {
            await fs.access(this.state.MODEL_DIR);
            
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromDisk(this.state.MODEL_DIR),
                faceapi.nets.faceLandmark68Net.loadFromDisk(this.state.MODEL_DIR),
                faceapi.nets.faceRecognitionNet.loadFromDisk(this.state.MODEL_DIR),
                faceapi.nets.faceExpressionNet.loadFromDisk(this.state.MODEL_DIR),
                faceapi.nets.ageGenderNet.loadFromDisk(this.state.MODEL_DIR)
            ]);

            this.state.loaded = true;
            return true;
        } catch (error) {
            console.error('❌ Erreur lors du chargement des modèles:', error);
            return false;
        } finally {
            this.state.loading = false;
        }
    }

    async reset() {
        this.state.loaded = false;
        this.state.loading = false;
        return await this.load();
    }

    startHealthCheck() {
        setInterval(async () => {
            if (this.state.loaded && !this.state.loading) {
                try {
                    await faceapi.nets.ssdMobilenetv1.loadFromDisk(this.state.MODEL_DIR);
                } catch (error) {
                    console.error('❌ Erreur de santé des modèles, réinitialisation...');
                    await this.reset();
                }
            }
        }, 30 * 60 * 1000);
    }
}

const manager = new ModelManager();
manager.startHealthCheck();
module.exports = manager; 