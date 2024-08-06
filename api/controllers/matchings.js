const matching = require("../models/matching");
const user = require("../models/user");
const _ = require('lodash');

module.exports.retrieveMatchHistory = async (req, res) => {

    try{
        const userId = req.params.userId;

        // Basic Validation
        if(!userId) return res.type('json').status(400).send('The user id is missing');   
        
        // Check if the filters exist
        const userList = []; 
        const cursor = matching.find({ $or:[ {'firstUser':  userId}, {'secondUser': userId} ]}).sort('timestamp').cursor();
        for (let match = await cursor.next(); match != null; match = await cursor.next()) {
            if(match.firstUser !== userId){
                userList.push(await user.findOne({_id:match.firstUser}).exec());
            }else if(match.secondUser !== userId){
                userList.push(await user.findOne({_id:match.secondUser}).exec());
            }
        }
        
        return res.type('json').status(200).send(userList);
      
    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
}