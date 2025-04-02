const { getIO } = require('../socket');

class NotificationService {
    constructor() {
        this.io = getIO();
    }

    notifyAnalysisStatus(userId, analysisId, status, data) {
        try {
            this.io.to(userId).emit(`analysis${status}`, {
                id: analysisId,
                timestamp: Date.now(),
                ...data
            });
        } catch (error) {
            console.error('Erreur de notification WebSocket:', error);
        }
    }

    notifyError(userId, analysisId, error) {
        this.notifyAnalysisStatus(userId, analysisId, 'Error', {
            error: error.message || 'Une erreur est survenue'
        });
    }

    notifyProgress(userId, analysisId, progress) {
        this.notifyAnalysisStatus(userId, analysisId, 'Progress', {
            progress
        });
    }
}

module.exports = new NotificationService(); 