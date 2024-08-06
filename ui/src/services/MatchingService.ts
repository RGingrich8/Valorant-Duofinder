import axios from 'axios';
import { IUser } from '../models/AuthModels';
import { ApiConfig } from '../util/ApiConfig';

export interface IMatchingResponse {
    data : IUser[] | string;
    statusCode : number;
}

export class MatchingService{

    public static retrieveHistory = async (userId : string) : Promise<IMatchingResponse> => {
        
        try{
            let response = await axios({method: 'get', url: ApiConfig.retrieveMatchHistory(userId)});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
}