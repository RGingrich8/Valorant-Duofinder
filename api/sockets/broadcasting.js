const user = require("../models/user");
const matching = require("../models/matching");
const socketModel = require("../models/socketModel");
const filter = require("../models/filter");

// Used to keep track of who is connected and know their socket
const connectedUsers = new Map();
let matchingQueue = [];

function broadcasting(io){ // For connection and disconnection

    io.on("connection", async (socket) => {

        const connectedUserId = socket.handshake.query.userId;

        if(!connectedUserId){
            socket.emit(`error_user_connected`, {msg:`Invalid connected user id ${connectedUserId}.`});
            return; 
        }
        
        if(!connectedUsers.has(connectedUserId)){
            connectedUsers.set(connectedUserId, socket.id);

            // Check if entry exists in the db
            const socketInfo = await socketModel.findOne({userId:connectedUserId}).exec();
            if(socketInfo){
                if(socketInfo.socketId !== socket.socketId){
                    await socketModel.updateOne({userId:connectedUserId}, {socketId:socket.id}).exec();
                }
            }else{
                await new socketModel({
                    userId: connectedUserId,
                    socketId: socket.id
                }).save();
            }
            
            // save in database
            socket.emit(`success_user_connected`, {msg:`User with id ${connectedUserId} CONNECTED.`});
        }else{
            socket.emit(`error_user_connected`, {msg:`User with id ${connectedUserId} is already connected.`});
        }

        /* MATCHING */

        socket.on('find_matching', async (findMatchDTO) => {
            
            // In case user id is invalid.
            if(!findMatchDTO.userId){
                socket.emit('error_find_matching',{msg:'User id is invalid.'});
                return;
            }
            if(!findMatchDTO.filters){
                socket.emit('error_find_matching', {msg:"Filters are invalid."});
                return;
            }

            // In case user id is not found
            if(!connectedUsers.has(findMatchDTO.userId)){
                socket.emit('error_find_matching', {msg:'User id does not exist.'});
                return;
            }

            socket.emit('success_find_matching', {msg:`User with id ${findMatchDTO.userId} ONLINE.`});

            // Attempting to find a match
            let matchFound = -1;
            const user1 = await user.findOne({_id:findMatchDTO.userId}).exec();
            const user1Filters = findMatchDTO.filters;
            for(let i = 0; i < matchingQueue.length && matchFound == -1; i++){
                var user2Id = matchingQueue[i];
                matching.countDocuments( {$or: [ { $and:[ {'firstUser':  findMatchDTO.userId}, {'secondUser': user2Id} ]}, { $and:[ {'firstUser':  user2Id}, {'secondUser': findMatchDTO.userId} ]}]}).exec().then( count => {    
                    if(!count){
                        user.findOne({_id:user2Id}).exec().then( user2 => {
                            filter.findOne({userId:user2Id}).exec().then( user2Filters => {
                                
                                // Region Matched
                                const regionMatched = (user1.region === user2Filters.serverPreference) && (user2.region === user1Filters.serverPreference);
                                
                                // Game Mode Type
                                const playerTypeMatched = (user1.playerType === user2Filters.gameMode) && (user2.playerType === user1Filters.gameMode);
                                
                                // Rank Macthed
                                const rankMatchedUser1 = (user1.rank[0]  >= user2Filters.rankDisparity[0] && user1.rank[0] <= user2Filters.rankDisparity[2]);
                                const rankMatchedUser2 = (user2.rank[0]  >= user1Filters.rankDisparity[0] && user2.rank[0] <= user1Filters.rankDisparity[2]);
                                const rankMatched = rankMatchedUser1 && rankMatchedUser2;
                                
                                // Age Matched
                                const ageMatched = (user1.age >= user2Filters.ageRange[0] && user1.age <= user2Filters.ageRange[1]) && 
                                                (user2.age >= user1Filters.ageRange[0] && user2.age <= user1Filters.ageRange[1]);
                                
                                // Gender Matched
                                let genderMatched = false;
                                if(user1.gender !== -1 && user2.gender !== -1){
                                    genderMatched = user2Filters.genders[user1.gender] && user1Filters.genders[user2.gender];
                                }

                                // They are match based on filters...
                                if(regionMatched && playerTypeMatched && rankMatched && ageMatched && genderMatched){
                                    
                                    // Notify each user of the match and remove the matched user from queue
                                    socket.emit('match_found', {user:user2});

                                    if(!connectedUsers.has(user2Id)){
                                        socketModel.findOne({userId:receiverId}).exec().then( socketInfo => {
                                            if(socketInfo){
                                                connectedUsers.set(socketInfo.userId, socketInfo.socketId);
                                                io.to(socketInfo.socketId).emit('match_found', {user:user1}); 
                                            }
                                        });
                                    }else{
                                        io.to(connectedUsers?.get(user2Id)).emit('match_found', {user:user1}); // TODO: add DB call if not in there
                                    }

                                    // Store matching in the DB
                                    const newMatch = new matching({ 
                                        firstUser: findMatchDTO.userId,
                                        secondUser: user2Id,
                                    });
                                    newMatch.save();
                                    
                                    // Remove matched user from queue 
                                    matchingQueue = immutableRemove(matchFound, matchingQueue);
                                    matchFound = i;
                                }                
                            });
                        });
                    }
                });
            }
            if(matchFound === -1){
                matchingQueue.push(findMatchDTO.userId);     
            } 
        });

        socket.on('stop_matching', (userId) => {
            // In case user id is invalid.
            if(!userId){
                socket.emit('error_stop_matching',{msg:'User id is invalid.'});
                return;
            }

            // In case user id is not found
            if(!connectedUsers.has(userId)){
                socket.emit('error_stop_matching', {msg:'User id does not exist.'});
                return;
            }

            // Removing user from the matching queue
            matchingQueue = immutableRemove(matchingQueue.indexOf(userId), matchingQueue);

            socket.emit('success_stop_matching', {msg:`User with id ${userId} OFFLINE`});
        });

        /* CHAT */
        socket.on("send_msg" , async (receiverId, msg) => { // msg = Text 

            if(!receiverId){
                socket.emit('error_send_msg', {msg:"Invalid receiver id."});
                return;
            }

            if(!connectedUsers.has(receiverId)){
                
                // Check if it exists in DB
                const socketInfo = await socketModel.findOne({userId:receiverId}).exec();

                if(!socketInfo){    
                    socket.emit('error_send_msg', {msg:"User with that id is not online."})
                    return;
                }else{
                    connectedUsers.set(receiverId, socketInfo.socketId);
                    io.to(socketInfo.socketId).emit("receive_msg", {msg:msg});
                }

            }else{
                io.to(connectedUsers?.get(receiverId)).emit("receive_msg", {msg:msg});
            }
        });

        /* DISCONNECT*/
        socket.on("disconnect", (socket) => {
    
            const connectedUserId = getUserIdFromSocketId(socket.id);
            if(!connectedUserId) return; 
        
            // Remove user from map 
            if(connectedUsers.has(connectedUserId)){
                connectedUsers.delete(connectedUserId);
            }
        });
    });
}

/* HELPER FUNCTIONS */

function getUserIdFromSocketId(socketId){
    let userId = "";
    for (let [uId, info] of connectedUsers) {
        if(info.socketId === socketId){
            userId = uId;
            break;
        }
    }
    return userId;
}

function immutableRemove(idx, array){
    
    if(idx < 0 || idx >= array.length) return array;
     
    newArray = [];
    for(let i = 0; i < array.length; i++){
        if(idx !== i) newArray.push(array[i]);
    }
    return newArray;
}

module.exports = { broadcasting };