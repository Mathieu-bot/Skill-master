const { createWorker } = require('tesseract.js');

class TesseractService {
    constructor() {
        this.workers = new Map();
        this.MAX_WORKERS = 3;
        
        // Ajouter le nettoyage automatique
        setInterval(() => this.cleanup(), 10 * 60 * 1000); // Toutes les 10 minutes
    }

    async getWorker() {
        const availableWorker = Array.from(this.workers.values()).find(w => !w.busy);
        if (availableWorker) {
            availableWorker.busy = true;
            return availableWorker;
        }

        if (this.workers.size < this.MAX_WORKERS) {
            const worker = await createWorker('fra');
            const wrappedWorker = {
                worker,
                busy: true,
                lastUsed: Date.now()
            };
            this.workers.set(worker, wrappedWorker);
            return wrappedWorker;
        }

        // Attendre qu'un worker soit disponible
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const availableWorker = Array.from(this.workers.values()).find(w => !w.busy);
                if (availableWorker) {
                    clearInterval(interval);
                    availableWorker.busy = true;
                    resolve(availableWorker);
                }
            }, 100);
        });
    }

    async releaseWorker(wrappedWorker) {
        wrappedWorker.busy = false;
        wrappedWorker.lastUsed = Date.now();
    }

    async cleanup() {
        const now = Date.now();
        const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

        for (const [worker, wrapped] of this.workers.entries()) {
            if (!wrapped.busy && (now - wrapped.lastUsed) > IDLE_TIMEOUT) {
                await wrapped.worker.terminate();
                this.workers.delete(worker);
            }
        }
    }
}

module.exports = new TesseractService(); 