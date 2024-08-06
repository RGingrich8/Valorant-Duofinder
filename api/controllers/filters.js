const filter = require("../models/filter");
const _ = require('lodash');

module.exports.retrieve = async (req, res) => {

    try{
        const userId = req.params.userId;

        // Basic Validation
        if(!userId) return res.type('json').status(400).send('The user id is missing');   
        
        // Check if the filters exist
        var searchedFilters = await filter.findOne({userId:userId}).exec();
        
        if (!searchedFilters){             
            return res.type('json').status(404).send("Filters for specified user were not found.");  
        }else{
            return res.type('json').status(200).send(searchedFilters); 
        }

    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
}

module.exports.upsert = async(req, res) => {

    try{

        const {userId, filters} = req.body;

        // Basic Validation
        if(!userId) return res.type('json').status(400).send('The user id is missing');   
        
        // Check if the filters exist
        var searchedFilters = await filter.findOne({userId:userId}).exec();

        if(searchedFilters){ // Update the filters 

            if(!filters) return res.type('json').status(400).send('The filters are is missing');   

            const updatedFilters = await filter.findOneAndUpdate({userId:userId}, 
                                                                    {...filters},
                                                                    {returnOriginal: false});
            return res.type('json').status(200).send(updatedFilters);

        }else{ // Insert new filters [with default values]

            const newFilters = new filter({ 
                userId: userId,
            });
    
            await newFilters.save();

            return res.type('json').status(201).send(newFilters);  
        }

    }catch(err) {
        return res.type('json').status(500).send(err.toString());   
    }
}