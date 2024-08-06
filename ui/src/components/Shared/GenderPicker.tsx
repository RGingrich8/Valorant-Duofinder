import * as React from 'react'
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FilterContext } from '../../contexts/FilterContext';
import { Gender } from '../../models/FiltersModels';
import { CustomToast } from './CustomToast';

interface IPos{
    left : number;
    top : number;
}

export function GenderPicker() : React.ReactElement{

    /* Filter context */
    const filterContex = React.useContext(FilterContext);

    /* State */
    const [horizontalLinePos, setHorizontalLinePos] = React.useState<IPos>({left:0,top:0});
    const [genders, setGenders] = React.useState<boolean[]>([true, true, true, true]);

    /* Refs */

    const allGendersInput = React.useRef(null);

    React.useEffect(() => {

        setHorizontalLinePos({
            left: allGendersInput?.current?.offsetLeft ?? 0,
            top: allGendersInput?.current?.offsetTop + 1 ?? 0
        });
        function handleWindowResize() {
            setHorizontalLinePos({
                left: allGendersInput?.current?.offsetLeft ?? 0,
                top: allGendersInput?.current?.offsetTop + 1 ?? 0
            });
        }
        window.addEventListener('resize', handleWindowResize);

        setGenders(filterContex?.filters?.genders ?? [true, true, true, true]);
    }, []);

    /* Handlers */

    function handleGenderChange(event : any, gender : Gender){
        
        // Make sure that at least one gender is selected
        let newGenders : boolean[] = [genders[Gender.allGenders], genders[Gender.woman], genders[Gender.man], genders[Gender.nonBinary]];
        if(gender === Gender.allGenders && event.target.checked){ // if all genders is selected, select all other checkboxes
            newGenders[Gender.allGenders] = true;
            newGenders[Gender.man] = true;
            newGenders[Gender.woman] = true;
            newGenders[Gender.nonBinary] = true;
        }else if(gender === Gender.allGenders && !event.target.checked){ // if all gender is deselected, deselect all but one
            newGenders[Gender.allGenders] = false;
            newGenders[Gender.man] = false;
            newGenders[Gender.woman] = true;
            newGenders[Gender.nonBinary] = false;
        }else if(genders[Gender.allGenders] && gender !== Gender.allGenders && !event.target.checked){ // if all genders is selected, and one other checkbox is unselected
            newGenders[Gender.allGenders] = false;
            newGenders[Gender.man] = genders[Gender.man];
            newGenders[Gender.woman] = genders[Gender.woman];
            newGenders[Gender.nonBinary] = genders[Gender.nonBinary];
            newGenders[gender] = event.target.checked;
        }else if(gender !== Gender.allGenders && event.target.checked && !genders[Gender.allGenders]){
            newGenders[gender] = true;
            newGenders[Gender.allGenders] = (genders[Gender.man] && genders[Gender.woman]) || 
                                            (genders[Gender.nonBinary] && genders[Gender.woman]) ||
                                            (genders[Gender.man] && genders[Gender.nonBinary])
        }else{
            newGenders[Gender.allGenders] = genders[Gender.allGenders];
            newGenders[Gender.man] = genders[Gender.man];
            newGenders[Gender.woman] = genders[Gender.woman];
            newGenders[Gender.nonBinary] = genders[Gender.nonBinary];
            newGenders[gender] = event.target.checked;
        }

        // Make sure there is at least one gender selected
        if(!(newGenders[Gender.woman] || newGenders[Gender.man] || newGenders[Gender.nonBinary])){
            toast.error("At least one gender must be selected");
            return;
        }

        setGenders(newGenders);
        filterContex.updateGender(newGenders);
    }

    /* Helpers */ 

    // Add a function to load things based on filters

    return (<>
        <CustomToast/>
        <PickerContainer>
            <div className='checkbox-row'>
                <input type="checkbox" ref={allGendersInput} onChange={(e:any) => handleGenderChange(e, Gender.allGenders)} checked={genders[Gender.allGenders]}></input>
                <label>All Genders</label>
            </div>
            <div className='checkbox-row indent'>
                <input type="checkbox" onChange={(e:any) => handleGenderChange(e, Gender.woman)} checked={genders[Gender.woman]}></input>
                <label>Woman</label>
            </div>
            <div className='checkbox-row indent'>
                <input type="checkbox" onChange={(e:any) => handleGenderChange(e, Gender.man)} checked={genders[Gender.man]}></input>
                <label>Man</label>
            </div>
            <div className='checkbox-row indent'>
                <input type="checkbox" onChange={(e:any) => handleGenderChange(e, Gender.nonBinary)} checked={genders[Gender.nonBinary]}></input>
                <label>NB</label>
            </div>
            <div className='vertical-line' style={{top:horizontalLinePos.top, left:horizontalLinePos.left}}></div>
            <div id='horizontal1' className='horizontal-line' style={{top:horizontalLinePos.top, left:horizontalLinePos.left}}></div>
            <div id='horizontal2' className='horizontal-line' style={{top:horizontalLinePos.top, left:horizontalLinePos.left}}></div>
            <div id='horizontal3' className='horizontal-line' style={{top:horizontalLinePos.top, left:horizontalLinePos.left}}></div>
        </PickerContainer>
    </>);
}

const PickerContainer = styled.div`
    height: auto;
    width: 100%;
    position: relative;

    & input{
        height: 1.0vw;
        width: 1.0vw;
        margin-top: auto;
        margin-bottom: auto;
        z-index: 2;
        min-width: 5px;
        min-height: 5px;
    }

    & label{
        font-size: 1.0vw;
        margin-left: 5%;
    }

    & .checkbox-row{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        width: auto;
        margin-bottom: 4%;
    }

    & .indent{
        margin-left: 15%;
    }

    & .vertical-line{
        position: absolute;
        width: 0.45vw;
        height: 5.65vw;
        border-right: 1px solid #66C2A9;
        z-index: 0;
    }

    & .horizontal-line{
        position: absolute;
        border-bottom: 1px solid #66C2A9;
        width: 1vw;
        margin-left: 5.5%;
        z-index: 0;      
    }

    & #horizontal1{
        height: 2.2vw;

        @media screen and (max-width: 950px) {
            height: 2.0vw;
        }
    }

    & #horizontal2{
        height: 3.85vw;

        @media screen and (max-width: 950px) {
            height: 3.65vw;
        }
    }

    & #horizontal3{
        height: 5.6vw;

        @media screen and (max-width: 950px) {
            height: 5.4vw;
        }
    }
`;