const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    // Ajoutez ici d'autres champs si nécessaire
}, {
    timestamps: true
});

module.exports = mongoose.model('Client', ClientSchema);
