import axios from 'axios';
import { ISaveCommendDTO } from '../models/CommendationModels';
import { ApiConfig } from '../util/ApiConfig';

export interface ICommedationResponse {
    data : any;
    statusCode : number;
}

export class CommendationService{

    public static save = async (saveCommendDTO : ISaveCommendDTO) : Promise<ICommedationResponse> => {
    
        try{
            let response = await axios({method: 'post', url: ApiConfig.saveCommendRoute(), data: saveCommendDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
}