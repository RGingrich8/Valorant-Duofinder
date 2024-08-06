import axios from 'axios';
import { ILoginDTO, IRegisterDTO, IUpdateDTO, IUser } from '../models/AuthModels';
import { ApiConfig } from '../util/ApiConfig';

export interface IAuthResponse {
    data : IUser | string;
    statusCode : number;
}

export class AuthService{

    public static login = async (loginDTO : ILoginDTO) : Promise<IAuthResponse> => {
        try{
            let response = await axios({method: 'post', url: ApiConfig.loginRoute(), data: loginDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
    
    public static register = async (registerDTO : IRegisterDTO) : Promise<IAuthResponse> => {
        try{
            let response = await axios({method: 'post', url: ApiConfig.registerRoute(),data: registerDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }

    public static update = async (updateDTO : IUpdateDTO) : Promise<IAuthResponse> => {
        try{
            let response = await axios({method: 'put', url: ApiConfig.updateUserRoute(),data: updateDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }

    public static find = async (userId : string) : Promise<IAuthResponse> => {
        try{
            let response = await axios({method: 'get', url: ApiConfig.findUserRoute(userId)});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
}