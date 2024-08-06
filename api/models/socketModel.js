const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocketSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("SocketModel", SocketSchema);