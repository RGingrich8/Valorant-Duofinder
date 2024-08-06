const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FiltersSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    serverPreference: {
        type: Number,
        required: false,
        unique: false,
        default: 0 // na
    },
    gameMode: {
        type: Number,
        required: false,
        unique: false,
        default: 1 // casual
    },
    rankDisparity:{
        type: Array,
        required: false,
        unique: false,
        default: [1, 1, 5, 2]
    },
    ageRange:{
        type: Array,
        required: false,
        unique: false,
        default: [18, 25]
    },
    genders: {
        type: Array,
        required: false,
        unique: false,
        default: [true, true, true, true]
    }
});

module.exports = mongoose.model("Filters", FiltersSchema);