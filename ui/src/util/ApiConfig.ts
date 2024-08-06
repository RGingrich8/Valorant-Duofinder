import { EnvConfig } from "./EnvConfig";
import { IRetrieveDTO } from '../models/FiltersModels';

export class ApiConfig{

    private static baseRoute : string = EnvConfig.API_URL;

    /* User */
    public static loginRoute = () => this.baseRoute + `/users/login`;
    public static registerRoute = () => this.baseRoute + `/users/register`;
    public static updateUserRoute = () => this.baseRoute + `/users/update`;
    public static findUserRoute = (userId : string) => this.baseRoute + `users/${userId}`;

    /* Chat */
    public static saveMessageRoute = () => this.baseRoute + `/chats/save`;
    public static retrieveMessagesRoute = () => this.baseRoute + `/chats/retrieve`;

    /* History */
    public static retrieveMatchHistory = (userId : string) => this.baseRoute + `/matchings/${userId}`;

    /* Commend */
    public static saveCommendRoute = () => this.baseRoute + `/commendations`;

    /* Filters */
    public static upsertFiltersRoute = () => this.baseRoute + `/filters`;
    public static retrieveFiltersRoute = (retrieveDTO : IRetrieveDTO) => this.baseRoute + `/filters/${retrieveDTO.userId}`;
}