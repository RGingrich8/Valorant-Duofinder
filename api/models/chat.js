const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
    senderId: {
        type: String,
        required: true,
        unique: false,
    },
    receiverId:{
        type: String,
        required: true,
        unique: false
    },
    message: {
        type: String,
        required: true,
        unique: false,
    },
    timestamp : {
        type: Date,
        required: false,
        unique: false,
        default: Date.now
    }
});

module.exports = mongoose.model("Chats", ChatsSchema);