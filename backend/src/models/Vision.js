const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Vision = sequelize.define('Visions', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('processing', 'completed', 'failed'),
        defaultValue: 'processing'
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    results: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {
            description: null,
            objects: [],
            imageProperties: null
        }
    }
}, {
    timestamps: true
});

module.exports = Vision;
