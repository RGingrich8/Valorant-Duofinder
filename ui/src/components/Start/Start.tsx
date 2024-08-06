import * as React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Agents } from './Agents';
import { Form, FormType } from './Form';


type Props = {
    formType : FormType
}

export default function Start(props : Props) : React.ReactElement{
    
    const navigate = useNavigate();

    React.useEffect(() => {
        if(localStorage.getItem('loggedUser')){
            navigate('../landing');
        }
    }, []);

    return (
        <StartPage>
            <Agents formType={props.formType}></Agents>
            <Form formType={props.formType}></Form>
        </StartPage>
    );
}

const StartPage = styled.div`
    display: flex;
    flex-direction: row;
    background-color: black;
    min-width: 100vw;
    min-height: 100vh;
    position: relative;

    @media (max-width: 950px) {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 950px) and (orientation: landscape){
        height: 100vw;
        width: 100vw;
    }
`;