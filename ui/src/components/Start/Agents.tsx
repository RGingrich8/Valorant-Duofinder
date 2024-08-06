import * as React from 'react'
import styled from 'styled-components';
import { FormType } from './Form';

type Props = {
    formType : FormType
}

export function Agents(props : Props) : React.ReactElement<Props, any>{

    const { innerWidth: width, innerHeight: height } = window;
    const [imgHeight, setImgHeight] = React.useState(0);
    const imgRef = React.useRef(null);

    React.useEffect(() => {
        setImgHeight(imgRef.current?.clientHeight);
        function handleWindowResize() {
            setImgHeight(imgRef.current?.clientHeight);
        }
        window.addEventListener('resize', handleWindowResize);

    }, []);

    return (
        <AgentContainer formType={props.formType}>    
            <div className='text-container' style={{height: (imgHeight === 0 || (window.matchMedia("(orientation: landscape)").matches && (width <= 900 || height <= 700)))?'10%':`calc(100% - ${imgHeight}px)`}}>
                <p>Find teammates to play Valorant with! Climb up the ranks with like-minded players and make long lasting friendships.</p>
            </div>
            <img ref={imgRef} alt="Group of Agents"></img>
        </AgentContainer>
    );
}

const AgentContainer = styled.div((props : Props) =>`
    width: 67%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative; 

    & div{
        display: flex;
        align-items: center; 
        justify-content: center;
        width: 100%;
        padding: 5% 0;

        & p {
            color: white;
            font-size: 2.2vh;
            text-align: center;
            padding: 0 10%;

            @media (max-width: 950px) {
                display: none;
            }
        }
    }

    & img{
        display: block;
        position: absolute;
        bottom: 0;
        width: ${props.formType === FormType.Login?'88%':'86%'};

        content:url(${props.formType === FormType.Login?"/images/start_screen/agents_5.png":"/images/start_screen/agents_2.png"});

        @media only screen and (max-width: 950px){
            width: 100%;
            height: auto;
            content:url(${"/images/start_screen/agents_3.png"});
        }

        @media only screen and (max-width: 950px){
            position:absolute;
            bottom: 0;
        }

        @media only screen and (max-width: 700px){
            content:url($"/images/start_screen/agent_1.png"});
        } 

        @media only screen and (max-width: 700px) and (orientation: landscape){
            width: auto;
            height: 100%;
        }
    }

    @media (max-width: 950px) {
        height: 100%;
        width: 100%;
        position:absolute;
        bottom: 0;
        top: 0;        
    }
`);