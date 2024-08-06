// DTOs

export interface IReceiveMsgDTO{
    msg: string;
}

export interface ISaveMsgDTO{
    senderId : string, 
    receiverId : string
    message : string
}

export interface IRetrieveMsgsDTO{
    senderId : string, 
    receiverId : string 
}

export interface ILoadMsgDTO{
    senderId : string, 
    receiverId : string,
    message: string; 
}

// Models

export interface IMessage {
    userId : string;
    type: string;
    text: string;
    userIcon: string;
}