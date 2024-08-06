/* DTOs */

import { GameMode, Gender } from "./FiltersModels";

export interface IRegisterDTO{
    displayName : string;
    gameName : string;
    tagLine : string;
    email : string;
    password : string; 
    avatarImage : string; 
}

export interface ILoginDTO{
    email: string;
    password: string;
}

export interface IUpdateDTO{
    userId: string,
    displayName : string,
    age : number,
    gender : Gender, 
    playerType : GameMode,
    aboutMe: string,
    avatarImage: string
}

/* View Models */

export interface IUser{
    _id : string;
    riotId : string;
    displayName : string;
    gameName : string;
    tagLine : string;
    email : string;
    avatarImage : string;
    rank : number[];
    accountLevel : number;
    region : number;
    age : number;
    gender : number;
    reputation : number;
    playerType : number;
    aboutMe: string;
}