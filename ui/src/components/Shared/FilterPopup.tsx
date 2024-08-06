import * as React from 'react'
import styled from 'styled-components';
import { LoggedUserContext } from '../../contexts/LoggedUserContext';
import { GenderPicker } from './GenderPicker';
import { RankSlider } from './RankSlider';
import { FilterContext } from '../../contexts/FilterContext';
import { CustomToast } from './CustomToast';
import { toast } from 'react-toastify';
import { FiltersService, IFiltersResponse } from '../../services/FiltersService';
import { GameMode, ServerPreference } from '../../models/FiltersModels';
import { Micellaneous } from '../../util/Micellaneous';

type Props = {
    triggered : boolean;
    closeMe : () => void;
}

type PopupProps = {
    triggered : boolean;
}

export function FilterPopup(props : Props) : React.ReactElement<Props, any> {

    /* Logged user and filter contexts */
    const loggedUserContext = React.useContext(LoggedUserContext);
    const filterContex = React.useContext(FilterContext);

    /* Age Range Height */
    const [ageRangeHeight, setAgeRangeHeight] = React.useState<number>(0);
    const [compChecked, setCompChecked] = React.useState<boolean>(true);

    /* Refs */
    const serverPrefDiv = React.useRef(null);
    const gameModeTitle = React.useRef(null);

    const minAgeInput = React.useRef(null);
    const maxAgeInput = React.useRef(null);

    // Use effect 

    React.useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    });

    React.useEffect(() => {
        let serverPrefDivHeight = serverPrefDiv?.current?.clientHeight ?? 0
        let gameModeTitleHeight = gameModeTitle?.current?.clientHeight ?? 0
        setAgeRangeHeight(serverPrefDivHeight + gameModeTitleHeight);
        function handleWindowResize() {
            let serverPrefDivHeight = serverPrefDiv?.current?.clientHeight ?? 0
            let gameModeTitleHeight = gameModeTitle?.current?.clientHeight ?? 0    
            setAgeRangeHeight(serverPrefDivHeight + gameModeTitleHeight);
        }
        window.addEventListener('resize', handleWindowResize);

        setCompChecked(filterContex?.filters?.gameMode === GameMode.competitive ?? true);
    }, []);

    /* Handlers */ 

    function handleServerPrefChange(event : any){
        filterContex.updateServerPreference(Number(event.target.value));
    }

    function handleGameModeChange(event : any, gameMode : GameMode){
        setCompChecked(gameMode === GameMode.competitive); 
        filterContex.updateGameMode(gameMode);
    }

    function handleAgeRangeChange(event : any, isMin : boolean){

        // Check that value is a number
        if(isNaN(Number(event.target.value))){
            toast.error(`The ${isMin?'min':'max'} age must be an integer number.`);
            if(isMin) minAgeInput.current.value = ""
            else      maxAgeInput.current.value = ""
            return;
        }
        
        let newAges : number[] = null;
        if(isMin){
            newAges = [Number(event.target.value), filterContex.filters.ageRange[1]];
        }else{
            newAges = [filterContex.filters.ageRange[0], Number(event.target.value)];
        }

        filterContex.updateAgeRange(newAges);
    }

    async function handleSave(){
        try{

            if(filterContex.filters.ageRange[0] < 18){
                toast.error(`The min age must be greater than or equal to 18`);
                minAgeInput.current.value = ""
                filterContex.updateAgeRange([18, 25]);
                return;
            }else if(filterContex.filters.ageRange[0] > filterContex.filters.ageRange[1]){
                toast.error(`The min age must be less than or equal to the max age.`);
                minAgeInput.current.value = ""
                filterContex.updateAgeRange([18, filterContex.filters.ageRange[1]]);
                return;
            }else if(filterContex.filters.ageRange[1] < filterContex.filters.ageRange[0]){
                toast.error(`The max age must be greater than or equal to the min age.`);
                maxAgeInput.current.value = ""
                filterContex.updateAgeRange([filterContex.filters.ageRange[0], 25]);
                return;
            }

            // Call API to attempt save of filters
            const filterResponse : IFiltersResponse = await FiltersService.upsert({userId:loggedUserContext.loggedUser._id, filters:filterContex.filters});

            if(filterResponse.statusCode !== 200){ // Username already in use or Email already in use
                toast.error(filterResponse.data);
                return;
            }else{
                toast.success("Filters saved successfully");
                props.closeMe();
            }
        }catch(err){
            throw err
        }
    }

    return ( <>
        <CustomToast/>
        <Popup triggered={props.triggered}>
            <PopupContent>
                <div id='header'>
                    <p id='title'>CHAT FILTERS</p>
                    <p id='subtitle'>Choose who you want to match with</p>
                </div>
                <div id='body'>
                    <div id='left'>
                        <div style={{height: '25%'}} id='server-pref' className='row' ref={serverPrefDiv}>
                            <p>Server Preferences:</p>
                            <div className='selects'>
                                <select value={filterContex?.filters?.serverPreference ?? ServerPreference.na} className="sever-preferences" onChange={handleServerPrefChange}>
                                    <option value={ServerPreference.na}>{Micellaneous.serverPreferenceToString(ServerPreference.na, true)}</option>
                                    <option value={ServerPreference.eu}>{Micellaneous.serverPreferenceToString(ServerPreference.eu, true)}</option>
                                    <option value={ServerPreference.ap}>{Micellaneous.serverPreferenceToString(ServerPreference.ap, true)}</option>
                                    <option value={ServerPreference.kr}>{Micellaneous.serverPreferenceToString(ServerPreference.kr, true)}</option>
                                </select>
                            </div>
                        </div>
                        <div style={{height: '25%'}} id='game-mode' className='row'>
                            <p ref={gameModeTitle}>Game Mode:</p>
                            <div className="radios">
                                <div className='radio-group'> 
                                    <input type="radio"value="Competitive" onChange={(e:any) => handleGameModeChange(e, GameMode.competitive)} checked={compChecked}/>
                                    <label>Competitive</label> 
                                </div> 
                                <div className='radio-group'>
                                    <input type="radio" value="Casual" onChange={(e:any) => handleGameModeChange(e, GameMode.casual)} checked={!compChecked}/>
                                    <label>Casual</label>
                                </div> 
                            </div>
                        </div>
                        <div style={{height: '50%'}} id='rank-disparity' className='row'>
                            <p>Rank Disparity:</p>
                            <div className="ranks">
                                <RankSlider/>
                            </div>
                        </div>
                    </div>
                    <div id='right'>
                        <div id='age-range' style={{height: `calc(100% - (100% - ${ageRangeHeight}px))`}} className='row'>
                            <p>Age Range:</p>
                            <div className='ages'>
                                <input ref={minAgeInput} placeholder={`${filterContex?.filters?.ageRange[0]}` ?? 'Min'} type='text' maxLength={2} onChange={(e:any) => handleAgeRangeChange(e, true)}></input>
                                <p>to</p>
                                <input ref={maxAgeInput} placeholder={`${filterContex?.filters?.ageRange[1]}` ?? 'Max'} type='text' maxLength={2} onChange={(e:any) => handleAgeRangeChange(e, false)}></input>
                            </div>
                        </div>
                        <div id='match-me-with' style={{height: `calc(100% - ${ageRangeHeight}px)`}} className='row'>
                            <p>Match me with:</p>
                            <div className='genders'>
                                <GenderPicker></GenderPicker>
                            </div>
                        </div>
                    </div>
                </div>
                <div id='footer'>
                    <button id='cancel-btn' onClick={() => {props.closeMe()}}>CANCEL</button>
                    <button id='save-btn' onClick={handleSave}>SAVE</button>
                </div>
            </PopupContent>
        </Popup>
    </>);
}

const Popup = styled.div( (props : PopupProps) => `
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(0,0,0,0.7);
    display: ${props.triggered?'flex':'none'};
    align-items: center;
    justify-content: center;
    z-index: 5;
`);

const PopupContent = styled.div`
    display:flex;
    flex-direction:column;
    width: 35vw;
    height: 30vw;
    background-color: #282828;
    border-radius: 10%;
    padding: 2vw;
    transition: all 0.25s ease-in-out;

    & #header{
        text-align: center;
        height: 25%;

        & #title{
            font-size: 2.5vw;
            font-weight: bold;
            margin: 0;
            padding: 0;
        }

        & #subtitle{
            font-size: 1.2vw;
            margin: 0;
            padding: 0;
        }
    }

    & #body{
        display: flex;
        flex-direction: row;
        height: 60%;
        overflow: hidden;

        & p {
            font-size: 1.0vw;
            font-weight: bold;
            margin: 0;
            padding: 0;
        }

        & #left, #right{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        & .row{
            display: flex;
            flex-direction: column;
        }

        & #left{
            width: 70%;

            & .row{                
                height: 33.33%;
            }

            /* Server Preferences */
            & #server-pref{
   
                .selects{
                    display: flex;
                    align-items: center;
                    height: 100%;
                    width: 100%;

                    & select {
                        width: auto;
                        height: auto;
                        padding: 0.5vw;
                        border-radius: 12px;
                        background-color: #D9D9D9;
                        font-size: 0.7vw;
                        justify-content: left;

                        @media screen and (max-width: 950px) and (orientation: portrait){
                            width: auto;
                            height: auto;
                            font-size: 2.0vw;
                            transform: translate(-25%,0) scale(0.5);
                        }
                    }
                }
            }

            /* Game Mode */
            & #game-mode{

                & .radios{

                    display: flex;
                    flex-direction: row;
                    justify-content: left;
                    align-items: center;
                    width: 100%;
                    height: 100%;

                    & .radio-group{
                        display: flex;
                        flex-direction: row;
                        justify-content: left;
                        align-items: center;
                        background-color: #D9D9D9; 
                        padding: 0.2vw 0;
                        padding-right: 1vw;
                        border-radius: 10px;
                        color: black; 
                        width: auto;
                        height: 1.5vw;
                        font-size: 0.8vw; 
                        margin-right: 2%;
                    
                        & input{
                            accent-color: black;
                            height: 1vw;
                            width: 1vw;
                            margin-top: auto;
                            margin-bottom: auto;
                            min-width: 3px;
                            min-height: 3px;

                            &:hover{
                                cursor: pointer;
                            }

                            &:focus{
                                outline: none;
                            }
                        }

                        & label{
                            margin-left: 0.1vw;
                            font-size: 100%;
                        }
                    }
                }
            }

            /* Rank Disparity */
            & #rank-disparity{
                width: 100%;

                & .ranks{
                    display: flex;
                    height: 100%;
                    width: 100%;
                    justify-content: left;
                    margin-top: 3%;
                    /* align-items: center; */

                    & input{
                        width: 85%;
                        height: 10%;
                    }
                }
            }
        }

        & #right {
            width: 30%;

            & .row{
                height: 50%;
            }

            /* Age Range */
            & #age-range{
                display: flex;

                & .ages{
                    display: flex;
                    flex-direction: row;
                    justify-content: left;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                
                    & input{
                        width: 20%;
                        height: auto;
                        padding: 0.6vw;
                        border-radius: 35%;
                        background-color: #D9D9D9;
                        font-size: 0.8vw;
                        border: none;

                        &::placeholder{
                            text-align: center;
                            color: black;
                        }

                        &:focus{
                            outline: none;
                        }
                    }

                    & p{
                        font-size: 1.0vw;
                        font-weight: normal;
                        margin: 0 5%;
                    }
                }
            }
            
            /* Match Me With */
            & #match-me-with{

                & .genders{
                    display: flex;
                    flex-direction: row;
                    justify-content: left;
                    width: 100%;
                    height: 100%;
                    margin-top: 7%;
                }
            }
        }
    }

    & #footer{
        height: 15%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        & button{
            margin: 3%;
            padding: 2% 0;
            width: 7vw;
            font-size: 1.2vw;
            border-radius: 10px;
            color: white;
            border: none;
            font-weight: bold;

            &:hover{
                cursor: pointer;
            }
        }

        & #save-btn{
            background-color: #66C2A9;

            &:hover{
                background-color: #1cce9f;
            }
        }

        & #cancel-btn{
            background-color: #F94B4B;

            &:hover{
                background-color: #cb1e1e;
            }
        }
    }

    @media screen and (max-width: 950px) and (orientation: portrait){
        transform: scale(2.0);
    } 
`;