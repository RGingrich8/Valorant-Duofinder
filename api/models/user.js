const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    riotId: {
        type: String,
        required: false, 
        unique: false
    },
    displayName: {
        type: String,
        required: false,
        unique: false,
        default: ""
    },
    gameName: {
        type: String,
        required: true, 
        unique: false
    },
    tagLine:{
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true,               
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false
    },
    avatarImage: {
        type: String,
        required: true,
        unique: false
    },
    rank : {
        type: Array,
        required: true,
        unique: false
    },
    accountLevel : {
        type: Number,
        required: true ,
        unique: false
    },
    region : {
        type: Number,
        required: true,
        unique: false
    },
    age : {
        type: Number,
        required: false,
        unique: false,
        default: 0
    },
    gender : {
        type: Number,
        required: false,
        unique: false,
        default: -1
    },
    reputation : {
        type: Number,
        required: false,
        unique: false,
        default: 5 // In the middle 
    },
    playerType : {
        type: Number,
        required: false,
        unique: false,
        default: 1 // Casual 
    },
    aboutMe : {
        type: String,
        required: false,
        unique: false,
        default: ""
    }
});

module.exports = mongoose.model("User", UserSchema);