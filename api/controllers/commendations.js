const commendation = require("../models/commendation");
const user = require("../models/user");

module.exports.saveCommendation = async (req, res) => {
    try{
        const {commenderId, commendedId, score} = req.body;

        if(!commenderId)              return res.type('json').status(400).send("Commender id was not provided.");
        if(!commendedId)              return res.type('json').status(400).send("Commended id was not provided.");
        if(!score)                    return res.type('json').status(400).send("Score was not provided.");
        if(score <= 0 || score > 10)  return res.type('json').status(400).send("Score must be >= 1 and <= 10");

        // Make sure the person is not commending again
        let foundCommendation = await commendation.findOne({$and: [{commendedId:commendedId}, {commenderId:commenderId}]}).exec();
        if(foundCommendation) return res.type('json').status(400).send("You have already commended this user.");

        // Compute average reputation of commended person
        let totalReputation = score, totalNumOfCommends = 1, newReputation = 0;
        const cursor = commendation.find({commendedId:commendedId}).cursor();
        for (let commendation = await cursor.next(); commendation != null; commendation = await cursor.next()) {
            totalReputation += commendation.score;
            totalNumOfCommends += 1;
        }
        newReputation = Math.round(totalReputation/totalNumOfCommends);

        // Save New Commendation
        await new commendation({ 
            commendedId: commendedId,
            commenderId: commenderId,
            score: score
        }).save();
       
        // Update users reputation
        const updatedUser = await user.findOneAndUpdate({_id: commendedId}, 
                                                        {reputation:newReputation},
                                                        {returnOriginal: false});

        if(!updatedUser) return res.type('json').status(400).send("Commended user reputation could not be updated.");

       return res.type('json').status(200).send();

    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
};