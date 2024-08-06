import { Slider } from '@mui/material';
import * as React from 'react'
import styled from 'styled-components';
import { FilterContext } from '../../contexts/FilterContext';
import { RankLevel, RankType } from '../../models/FiltersModels';

export function RankSlider() : React.ReactElement{
    
    /* Filter Context */
    const filterContex = React.useContext(FilterContext);

    /* Constants */
    const marks = [{value: 0.8, label: ''}, {value: 1,label: ''},{value: 1.2,label: ''},{value: 1.8,label: ''},
                   {value: 2,label: ''},{value: 2.2,label: ''},{value: 2.8,label: ''},{value: 3,label: ''},
                   {value: 3.2,label: ''},{value: 3.8,label: ''},{value: 4,label: ''},{value: 4.2,label: ''},
                   {value: 4.8,label: ''},{value: 5,label: ''},{value: 5.2,label: ''},{value: 5.8,label: ''},
                   {value: 6,label: ''},{value: 6.2,label: ''},{value: 6.8,label: ''},{value: 7,label: ''},
                   {value: 7.2,label: ''},{value: 7.8,label: ''},{value: 8,label: ''},{value: 8.2,label: ''},
                   {value: 9,label: ''}];

    const [value, setValue] = React.useState<number[]>([5, 6]);

    /* Use Effect */ 
    React.useEffect(() => {
        setValue([toSliderRank(filterContex?.filters?.rankDisparity[0], filterContex?.filters?.rankDisparity[1]), 
                  toSliderRank(filterContex?.filters?.rankDisparity[2], filterContex?.filters?.rankDisparity[3])]);
    }, []);

    /* Handlers */

    const handleChange = (event: Event, newValue: number | number[], activeThumb: number) : void => {      
        if (!Array.isArray(newValue) || newValue[0] >= newValue[1] || !inCorrectRange(newValue[0]) || !inCorrectRange(newValue[1])) {
            return;
        }
        setValue([newValue[0], newValue[1]]);

        // Change filter context here
        filterContex.updateRankDisparity([...toRank(newValue[0]), ...toRank(newValue[1])]);
    };

    /* Helper Functions */

    const inCorrectRange = (value : number) : boolean => {
        let result : boolean = (value === 0.8 || value === 1 || value === 1.2);
        result  ||= (value === 1.8 || value === 2 || value === 2.2);
        result  ||= (value === 2.8 || value === 3 || value === 3.2);
        result  ||= (value === 3.8 || value === 4 || value === 4.2);
        result  ||= (value === 4.8 || value === 5 || value === 5.2);
        result  ||= (value === 5.8 || value === 6 || value === 6.2);
        result  ||= (value === 6.8 || value === 7 || value === 7.2);
        result  ||= (value === 7.8 || value === 8 || value === 8.2);
        result  ||= value === 9.0;
        return result;   
    }

    function toRankLevel(val : number) : RankLevel {
        let decimalPart = Number((val % 1).toFixed(2));
        let ans : RankLevel;
        if(decimalPart === 0.80)      ans = RankLevel.one
        else if(decimalPart === 0.00) ans = RankLevel.two
        else                          ans = RankLevel.three
        return ans;
    }

    function toRankType(val : number) : RankType{
        let integerPart = val - Number((val % 1).toFixed(2));
        let decimalPart = Number((val % 1).toFixed(2));
        if(decimalPart === 0.80) integerPart += 1;
        return integerPart
    }

    function toSliderRank(rankType : RankType, rankLevel : RankLevel) : number {

        let decimal : number = 0.0;
        if(rankLevel === RankLevel.one) decimal = -0.20;
        else                            decimal = 0.20;

        return rankType + decimal;
    }

    function toRank(val : number) : number[] {
        return [toRankType(val), toRankLevel(val)]
    }

    return (
        <OuterContainer>
            <CustomSlider value={value} onChange={handleChange} valueLabelDisplay="off"
                          disableSwap min={0.6} max={9.2} step={0.1} marks={marks}/>
            <RankIcons>
                <img style={{marginLeft:'2.7%'}} src={'images/ranks/rank_1_1.webp'} alt="rank 1"></img>
                <img style={{marginLeft:'5.0%'}} src={'/images/ranks/rank_2_1.webp'} alt="rank 2"></img>
                <img style={{marginLeft:'4.0%'}} src={'/images/ranks/rank_3_1.webp'} alt="rank 3"></img>
                <img style={{marginLeft:'5.0%'}} src={'/images/ranks/rank_4_1.webp'} alt="rank 4"></img>
                <img style={{marginLeft:'5.3%'}} src={'/images/ranks/rank_5_1.webp'} alt="rank 5"></img>
                <img style={{marginLeft:'5.0%'}} src={'/images/ranks/rank_6_1.webp'} alt="rank 6"></img>
                <img style={{marginLeft:'4.8%'}} src={'images/ranks/rank_7_1.webp'} alt="rank 7"></img>
                <img style={{marginLeft:'4.8%'}} src={'images/ranks/rank_8_1.webp'} alt="rank 8"></img>
                <img style={{marginLeft:'4.6%'}} src={'/images/ranks/rank_9_1.webp'} alt="rank 9"></img>
            </RankIcons>
        </OuterContainer>
    );
}

const OuterContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 4vw;
`;

const CustomSlider = styled(Slider)`
    margin-left: 0.2vw;
    margin-bottom: 6%;
    height: 0.1vw!important;
    padding: 0!important;


    & .MuiSlider-thumb {
      background-color: #BD3944;
      height: 0.8vw;
      width: 0.3vw;
      border-radius: 0;
    }

    & .MuiSlider-rail {
      color: #D9D9D9;
      height: 0.2vw;
      opacity: 100%;
      border-radius: 0;
    }

    & .MuiSlider-track{
        color: #BD3944;
    }

    & .MuiSlider-mark{
        color: white;
        height: 0.5vw;
        width: 0.15vw;
        margin-top: 4%;
    }
`;

const RankIcons = styled.div`
    display: flex;
    flex-direction: row;
    height: auto;
    width: auto;

    & img{
        height: 1.5vw;
        width: auto;
        padding: 0.4vw 0 0 0;
    }
`;