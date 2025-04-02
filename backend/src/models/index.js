const User = require('./User');
const Vision = require('./Vision');
const Voice = require('./Voice');

// Définition des relations
User.hasMany(Vision, {
    foreignKey: 'userId',
    as: 'visions'
});

Vision.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

User.hasMany(Voice, {
    foreignKey: 'userId',
    as: 'voices'
});

Voice.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = {
    User,
    Vision,
    Voice
};