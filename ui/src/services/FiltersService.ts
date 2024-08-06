import axios from 'axios';
import { IRetrieveDTO, IUpsertDTO } from '../models/FiltersModels';
import { ApiConfig } from '../util/ApiConfig';

export interface IFiltersResponse {
    data : any;
    statusCode : number;
}

export class FiltersService{

    public static retrieve = async (retrieveDTO : IRetrieveDTO) : Promise<IFiltersResponse> => {
    
        try{
            let response = await axios({method: 'get', url: ApiConfig.retrieveFiltersRoute(retrieveDTO)});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }

    public static upsert = async (upsertDTO : IUpsertDTO) : Promise<IFiltersResponse> => {

        try{
            let response = await axios({method: 'post', url: ApiConfig.upsertFiltersRoute(), data: upsertDTO});
            return {data:response?.data, statusCode:response?.status};
        }catch(err){
            return {data:err?.response?.data, statusCode:err?.response?.status};
        }
    }
}