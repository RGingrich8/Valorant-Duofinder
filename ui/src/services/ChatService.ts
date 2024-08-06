import axios from 'axios';
import { IRetrieveMsgsDTO, ISaveMsgDTO } from '../models/ChatModels';
import { ApiConfig } from '../util/ApiConfig';

export interface IChatResponse {
    data : any | string;
    statusCode : number;
}

export class ChatService{

    public static save = async (saveMsgDTO : ISaveMsgDTO) : Promise<IChatResponse> => {
        try{
            let response = await axios({method: 'post', url: ApiConfig.saveMessageRoute(), data: saveMsgDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }

    public static retrieve = async (retrieveMsgsDTO : IRetrieveMsgsDTO) : Promise<IChatResponse> => {
        try{
            let response = await axios({method: 'post', url: ApiConfig.retrieveMessagesRoute(), data: retrieveMsgsDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
}