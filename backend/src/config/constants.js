const path = require('path');

module.exports = {
    PATHS: {
        UPLOAD_DIR: path.join(process.cwd(), 'uploads', 'images'),
        TEMP_DIR: path.join(process.cwd(), 'uploads', 'temp'),
        MODEL_DIR: path.join(process.cwd(), 'models')
    },
    
    LIMITS: {
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
        MIN_FILE_SIZE: 1024, // 1KB
        MAX_WORKERS: 3,
        WORKER_TIMEOUT: 5 * 60 * 1000 // 5 minutes
    },
    
    FILE_TYPES: {
        ALLOWED_MIMES: ['image/jpeg', 'image/png', 'image/webp']
    }
}; 