const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchingSchema = new Schema({
    firstUser: {
        type: String,
        required: true,
        unique: false
    },
    secondUser: {
        type: String,
        required: true,
        unique: false
    },
    timestamp : {
        type: Date,
        required: false,
        unique: false,
        default: Date.now
    }
});

module.exports = mongoose.model("Matching", MatchingSchema);