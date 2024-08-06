import React from "react";
import { io, Socket } from "socket.io-client";
import { EnvConfig } from "../util/EnvConfig";

export type SocketContextType = {
    socket : Socket,
    updateSocket : (userId : string) => void
    closeSocket : () => void;
};

type Props = {
    children?: React.ReactNode;
};

export const SocketContext = React.createContext<SocketContextType | null>(null);

export function SocketProvider({children} : Props) { 

    const [socket, setSocket] = React.useState<Socket | null>(localStorage.getItem("loggedUser")?io(EnvConfig.SOCKET_URL, { query: { userId: `${JSON.parse(localStorage.getItem("loggedUser"))._id}` }, transports: ["websocket"], reconnectionDelayMax: 1000}):null);
    
    React.useEffect(() => {
        if(EnvConfig.DEBUG) console.log(`Socket: ${socket?.id ?? "NULL"}`);
    }, [socket]); 

    const closeSocket = () : void => {
        if(socket){
            socket.close();
        }
    }

    const updateUserId = (userId: string) : void => {
        setSocket(io(EnvConfig.SOCKET_URL, { query: { userId: `${userId}` }, transports: ["websocket"], reconnectionDelayMax: 1000}));
    }

    const value : SocketContextType = {socket: socket, updateSocket: updateUserId, closeSocket: closeSocket}

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
};