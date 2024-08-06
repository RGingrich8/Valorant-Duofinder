const bcrypt = require('bcrypt');
const user = require("../models/user");
const _ = require('lodash');
const axios = require('axios');

module.exports.registerUser = async (req, res) => {
    try{
        const{displayName, gameName, tagLine, email, password, avatarImage} = req.body;
        
        // Validation of body variables 
        if(!gameName)    return res.type('json').status(404).send('The game name is missing');   
        if(!tagLine)     return res.type('json').status(404).send('The tag line is missing');   
        if(!email)       return res.type('json').status(404).send('The email is missing');   
        if(!password)    return res.type('json').status(404).send('The password is missing');   
        
        let searchedUser = await user.findOne({gameName:gameName, tagLine:tagLine}).exec();
        if(searchedUser) return res.type('json').status(400).send("Game name and tagline combination already in use.");  

        // Getting user's extra info from riot's api
        const baseUrl1 = process.env.RIOT_BASE_URL1;
        const fullUrl1 = `${baseUrl1}${gameName}\\${tagLine}`

        let response = await axios.get(fullUrl1);
        var extraData = response.data.data;

        // Getting user's rank from riot's api
        const baseUrl2 = process.env.RIOT_BASE_URL2;
        const fullUrl2 = `${baseUrl2}${extraData.region}\\${gameName}\\${tagLine}`;

        let response2 = await axios.get(fullUrl2);
        let rank = parseRank(response2.data.data.currenttierpatched);

        const newUser = new user({ 
            riotId: extraData.puuid,
            displayName: !displayName?gameName:displayName,
            gameName: gameName,
            tagLine: tagLine,
            email: email,
            password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            avatarImage: avatarImage,
            rank: [rank.rankType, rank.rankLevel],
            accountLevel: extraData.account_level,
            region: toRegionNo(extraData.region)
        });

        await newUser.save();

        return res.type('json').status(201).send( _.pick(newUser, ['_id', 'riotId', 'displayName', 'gameName','tagLine', 'email', 'avatarImage', 'rank', 'accountLevel', 'region', 'age', 'gender', 'reputation', 'playerType', 'aboutMe']));  

    }catch(err){
        return res.type('json').status(500).send(err.toString());   
    }
}

module.exports.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email) return res.type('json').status(404).send('The username is missing');   
        if(!password) return res.type('json').status(404).send('The password is missing');   
        
        // Check if the username exists
        var searchedUser = await user.findOne({email:email}).select("+password").exec();
        
        if (!searchedUser){             
            return res.type('json').status(404).send("User was not found.");  
        }else{
            // Check if the passwords match
            const isPasswordValid = await bcrypt.compare(password, searchedUser.password);
            if(!isPasswordValid){
                return res.type('json').status(404).send("The password is incorrect.");   
            }
            return res.type('json').status(200).send(_.pick(searchedUser, ['_id', 'riotId', 'displayName', 'gameName','tagLine','email', 'avatarImage', 'rank', 'accountLevel', 'region', 'age', 'gender', 'reputation', 'playerType', 'aboutMe'])); 
        }
       
    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
};

module.exports.updateUser = async (req, res) => {
    try{
        const updateDTO = req.body;

        if(!updateDTO.userId) return res.type('json').status(400).send('A user id must be provided');   
    
        // Check if the username exists
        var searchedUser = await user.findOne({_id:updateDTO.userId}).exec();
        
        if (!searchedUser){             
            return res.type('json').status(404).send("User to update was not found.");  
        }else{

            let updateParams = _.pick(updateDTO, ['displayName', 'age', 'gender', 'playerType', 'aboutMe', 'avatarImage']);
            const updatedUser = await user.findOneAndUpdate({_id:updateDTO.userId}, 
                                                               {...updateParams},
                                                               {returnOriginal: false});
            
            return res.type('json').status(200).send(updatedUser);
        }
       
    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
};

// Implement end-point to retrieve a user by ID (we only have login)

module.exports.findUser = async (req, res) => {
    try{
        const userId = req.params.userId;

        if(!userId) return res.type('json').status(400).send('Invalid user id provided.');   
        
        // Find the user
        var searchedUser = await user.findOne({_id:userId}).exec();
        
        if (!searchedUser){             
            return res.type('json').status(404).send("User was not found.");  
        }else{
            return res.type('json').status(200).send(_.pick(searchedUser, ['_id', 'riotId', 'displayName', 'gameName','tagLine','email', 'avatarImage', 'rank', 'accountLevel', 'region', 'age', 'gender', 'reputation', 'playerType', 'aboutMe'])); 
        }
       
    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
};

/* Helper Functions */

function toRegionNo(region){
    let res = -1;
    switch(region){
        case 'na':
            res = 0;
            break;
        case 'eu':
            res = 1;
            break;
        case 'ap':
            res = 2;
            break;
        case 'kr':
            res = 3;
            break;
    }
    return res;
}

function parseRank(rank){

    let rankName = rank.substring(0, rank.indexOf(" "));
    
    let rankType = -1;
    let rankLevel = rank.substring(rank.indexOf(" ") + 1) * 1;

    switch(rankName.toLowerCase()){
        case 'iron':
            rankType = 1;
            break;
        case 'bronze':
            rankType = 2;
            break;
        case 'silver':
            rankType = 3;
            break;
        case 'gold':
            rankType = 4;
            break;
        case 'platinum':
            rankType = 5;
            break;
        case 'diamond':
            rankType = 6;
            break;
        case 'ascendant':
            rankType = 7;
            break;
        case 'immortal':
            rankType = 8;
            break;
        case 'radiant':
            rankType = 9;
            break;
    }

    return {rankType: rankType, rankLevel: rankLevel};
}