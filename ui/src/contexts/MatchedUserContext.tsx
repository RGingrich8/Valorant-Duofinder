import React from "react";
import { IUser } from "../models/AuthModels";
import { EnvConfig } from '../util/EnvConfig';

export type MatchedUserContextType = {
    matchedUser : IUser,
    updateMatchedUser : (matchedUser : IUser) => void
};

type Props = {
    children?: React.ReactNode;
};

export const MatchedUserContext = React.createContext<MatchedUserContextType | null>(null);

export function MatchedUserProvider({children} : Props) { 

    const [matchedUser, setMatchedUser] = React.useState<IUser | null>(localStorage.getItem("matchedUser")?JSON.parse(localStorage.getItem("matchedUser")):null);
    
    React.useEffect(() => {
        if(EnvConfig.DEBUG) console.log(`Matched User: ${matchedUser ?? "NULL"}`);
        if(matchedUser) localStorage.setItem('matchedUser', JSON.stringify(matchedUser));
    }, [matchedUser]); 

    const updateMatchedUser = (loggedUser: IUser) : void => {
        setMatchedUser(loggedUser);
    }

    const value : MatchedUserContextType = {matchedUser:matchedUser, updateMatchedUser:updateMatchedUser}

    return <MatchedUserContext.Provider value={value}>{children}</MatchedUserContext.Provider>
};