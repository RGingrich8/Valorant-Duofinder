const chats = require("../models/chat");
const _ = require('lodash');

module.exports.saveMessage = async (req, res) => {
    try{
        const {senderId, receiverId, message} = req.body;

        if(!senderId)    return res.type('json').status(400).send("Sender id was not provided.");
        if(!receiverId)  return res.type('json').status(400).send("Receiver id was not provided.");
        if(!message)     return res.type('json').status(400).send("Message was not provided");

        const newChat = new chats({ 
            senderId:senderId,
            receiverId:receiverId,
            message:message
        });

        await newChat.save();

        return res.type('json').status(201).send(newChat);

    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
};

module.exports.retrieveMessages = async (req, res) => {
    try{
        const {senderId, receiverId} = req.body;
        
        if(!senderId)   return res.type('json').status(400).send("Sender id was not provided.");
        if(!receiverId) return res.type('json').status(400).send("Receiver id was not provided.");

        const messages = [];
        const cursor = chats.find({$or : [{$and:[{senderId:senderId}, {receiverId:receiverId}]}, {$and:[{senderId:receiverId}, {receiverId:senderId}]}]}).sort("timestamp").cursor();
        for (let message = await cursor.next(); message != null; message = await cursor.next()) {
            messages.push({senderId:message.senderId, receiverId:message.receiverId, message:message.message});
        }

        return res.type('json').status(200).send(messages);

    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
}