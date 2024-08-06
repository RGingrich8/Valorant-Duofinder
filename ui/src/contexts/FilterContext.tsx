import React from "react";
import { GameMode, IFilters } from "../models/FiltersModels";
import { EnvConfig } from "../util/EnvConfig";

export type FiltersContextType = {
    filters : IFilters,
    updateServerPreference : (serverPreference : number) => void,
    updateGameMode : (gameMode : GameMode) => void,
    updateRankDisparity : (rankDisparity : number[]) => void,
    updateAgeRange : (ageRange : number[]) => void,
    updateGender : (genders : boolean[]) => void,
    updateFilter : (filters : IFilters) => void
};

type Props = {
    children?: React.ReactNode;
};

export const FilterContext = React.createContext<FiltersContextType | null>(null);

export function FilterProvider({children} : Props) { 

    const [filters, setFilters] = React.useState<IFilters | null>(localStorage.getItem("filters")?JSON.parse(localStorage.getItem("filters")):null);
    
    React.useEffect(() => {
        if(EnvConfig.DEBUG) console.log(`Filters: ${filters ?? "NULL"}`);
        if(filters) localStorage.setItem('filters', JSON.stringify(filters));
    }, [filters]); 

    function updateServerPreference (serverPreference : number) : void{
        setFilters({...filters, serverPreference: serverPreference});
    }
    
    function updateGameMode(gameMode : GameMode) : void {
        setFilters({...filters, gameMode: gameMode});
    }

    function updateRankDisparity(rankDisparity : number[]) : void{
        setFilters({...filters, rankDisparity: rankDisparity});
    }

    function updateAgeRange(ageRange : number[]) : void{
        setFilters({...filters, ageRange: ageRange});
    }
    
    function updateGender(genders : boolean[]) : void{
        setFilters({...filters, genders: genders});
    }

    function updateFilter(filters : IFilters) : void{
        setFilters(filters);
    }

    const value : FiltersContextType = {filters:filters, updateServerPreference:updateServerPreference,
                                        updateGameMode:updateGameMode, updateRankDisparity:updateRankDisparity,
                                        updateAgeRange:updateAgeRange, updateGender:updateGender,
                                        updateFilter:updateFilter}

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
};