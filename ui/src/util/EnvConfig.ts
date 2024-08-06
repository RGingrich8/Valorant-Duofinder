export class EnvConfig{

    /* Enviroment variables for api config */
    private static API_HOST : string = process.env.REACT_APP_API_HOST ?? "";
    private static API_PORT : string = process.env.REACT_APP_API_PORT ?? "";
    public static API_URL : string = `http://${EnvConfig.API_HOST}:${EnvConfig.API_PORT}`;

    /* Enviroment variables for socket.io config */
    private static SOCKET_HOST : string = process.env.REACT_APP_SOCKET_HOST ?? "";
    private static SOCKET_PORT : string = process.env.REACT_APP_SOCKET_PORT ?? "";
    public static SOCKET_URL : string = `http://${EnvConfig.SOCKET_HOST}:${EnvConfig.SOCKET_PORT}`;

    /* Others */
    public static DEBUG : boolean = ( (process.env.REACT_APP_DEBUG??'true') === 'true');
}