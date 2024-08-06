const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommendationsSchema = new Schema({
    commenderId: {
        type: String,
        required: true,
        unique: false,
    },
    commendedId:{
        type: String,
        required: true,
        unique: false
    },
    score: {
        type: Number,
        required: true,
        unique: false,
    }
});

module.exports = mongoose.model("Commendations", CommendationsSchema);