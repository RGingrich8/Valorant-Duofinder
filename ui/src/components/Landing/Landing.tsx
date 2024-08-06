import * as React from "react";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import LandingCard from "./LandingCard";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { EnvConfig } from "../../util/EnvConfig";
import { MatchedUserContext } from "../../contexts/MatchedUserContext";
import { Micellaneous } from "../../util/Micellaneous";
import { CustomToast } from "../Shared/CustomToast";
import { FilterContext } from "../../contexts/FilterContext";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { FilterPopup } from "../Shared/FilterPopup";
import { useNavigate } from "react-router-dom";
import { SocketContext } from '../../contexts/SocketContext';

export default function Landing() {
  
  const {state} = useLocation();
  
  // State
  const [duoFound, setDuoFound] = useState<boolean>(false);
  const [findDuo, setFindDuo] = useState<boolean>(false);
  const [triggered, setTriggered] = React.useState(false);

  const [bgAgent1, setBgAgent1] = useState("");
  const [bgAgent2, setBgAgent2] = useState("");
  const [logout, setLogout] = useState(false);

  // Refs
  const pollingTimeout = React.useRef<NodeJS.Timeout>(null);

  // Contexts
  const loggedUserContext = useContext(LoggedUserContext);
  const matchedUserContext = useContext(MatchedUserContext);
  const filterContext = useContext(FilterContext);
  const socketContext = useContext(SocketContext);

  const navigate = useNavigate();
  // Use Effects

  useEffect(() => {
    // Display a toast if we came from registration screen 
    if(state?.justRegistered){
      toast.warning("Please edit your gender and age to be able to be better matched!")
    }
  }, []);

  useEffect(() => {
    // Messages from server
    socketContext?.socket?.on("error_user_connected", handleSuccessOrError);
    socketContext?.socket?.on("success_user_connected", handleSuccessOrError);
    socketContext?.socket?.on("error_find_matching", handleSuccessOrError);
    socketContext?.socket?.on("success_find_matching", handleSuccessOrError);
    socketContext?.socket?.on("error_stop_matching", handleSuccessOrError);
    socketContext?.socket?.on("success_stop_matching", handleSuccessOrError);
    socketContext?.socket?.on("match_found", handleMatchFound);

    return () => {
      if (pollingTimeout) clearTimeout(pollingTimeout.current);
    };
  }, []);

  useEffect(() => {
         
    let bgAgents = Micellaneous.getBackgroundAgents(
      loggedUserContext?.loggedUser?.avatarImage
    );
    setBgAgent1(bgAgents[0]);
    setBgAgent2(bgAgents[1]);
  }, []);

  /* Handlers */

  function handleCloseMe() {
    setTriggered(false);
  }

  function handleSuccessOrError(res: any): void {
    if (EnvConfig.DEBUG) console.log(res);
  }

  async function handleMatchFound(res: any): Promise<void> {
    // Store matched user in context
    matchedUserContext.updateMatchedUser(res.user);

    // Stop timeout
    if (pollingTimeout) clearTimeout(pollingTimeout.current);

    setDuoFound(true);
  }

  const handleLogout = () =>{ 
    localStorage.clear();
    navigate('../login');
    socketContext.closeSocket();
  }

  async function clickedFindDuo(): Promise<void> {
    
    if(localStorage.getItem("matchedUser")){
      navigate('./chat')
      return;
    }
    
    setFindDuo(true);

    socketContext?.socket?.emit("find_matching", {
      userId: loggedUserContext?.loggedUser?._id,
      filters: filterContext.filters,
    } as any);

    pollingTimeout.current = setTimeout(() => {
      toast.error("Could not find a match. Please try again later!");
      setFindDuo(false);
      socketContext?.socket?.emit("stop_matching", loggedUserContext?.loggedUser?._id);
    }, 300000); // 5 mins
  }

  function clickedCancel(): void {
    setFindDuo(false);
    if (pollingTimeout) clearTimeout(pollingTimeout.current);
    socketContext?.socket?.emit("stop_matching", loggedUserContext?.loggedUser?._id);
  }

  function clickedUser(): void{
    setLogout(!logout);
  }
  /* Helper Functions */

  function getButton(): any {
    return findDuo ? (
      <Cancel onClick={clickedCancel}>&#10005; CANCEL</Cancel>
    ) : (
      <FindDuo onClick={clickedFindDuo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          id="magnifyingGlass"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
        </svg>
        FIND DUO
      </FindDuo>
    );
  }


  function showChatButtons(): any {
    return findDuo || duoFound ? (
      <div></div>
    ) : (
      <ButtonContainer>
        <div>
          <Button id="filter" onClick={() => setTriggered(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              id="filterIcon"
            >
              <path d="M0 416c0-17.7 14.3-32 32-32l54.7 0c12.3-28.3 40.5-48 73.3-48s61 19.7 73.3 48L480 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-246.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 448c-17.7 0-32-14.3-32-32zm192 0c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zM384 256c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm-32-80c32.8 0 61 19.7 73.3 48l54.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-54.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l246.7 0c12.3-28.3 40.5-48 73.3-48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32s-14.3-32-32-32zm73.3 0L480 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-214.7 0c-12.3 28.3-40.5 48-73.3 48s-61-19.7-73.3-48L32 128C14.3 128 0 113.7 0 96S14.3 64 32 64l86.7 0C131 35.7 159.2 16 192 16s61 19.7 73.3 48z" />
            </svg>
            CHAT FILTERS
          </Button>
        </div>
        <History>
          <HistoryLink>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              id="historyIcon"
            >
              <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" />
            </svg>
            <Link
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                  to={"/history"}
            >CHAT HISTORY </Link>            
          </HistoryLink>
        </History>
      </ButtonContainer>
    );
  }

  function showLogout(){
    return logout ?
    (<User>
       <StopLogout onClick={clickedUser}>&#10005;</StopLogout>
       <Logout onClick={handleLogout}>LOGOUT</Logout>
    </User>
   )
     :  
    (<User onClick={clickedUser}>
      <p id="username">
        {Micellaneous.toTitleCase(
        loggedUserContext?.loggedUser?.displayName
        ) ?? "<username>"}
      </p>
      <img id="profilePic"
        src={loggedUserContext?.loggedUser?.avatarImage}
        alt="Player Icon">
      </img>
    </User>);
  }



  return (
    <>
      <CustomToast></CustomToast>
      <LandingPage>
        <FilterPopup
          closeMe={handleCloseMe}
          triggered={triggered}
        ></FilterPopup>
        <Nav>
          <Logo>
            <h2 id="valorant">VALORANT</h2>
            <h1 id="duofinder">DUOFINDER</h1>
          </Logo>
          <UserDiv>
            {showLogout()}
          </UserDiv>
        </Nav>
        <LandingContent>
          <Agent src={bgAgent1}></Agent>
          <Container>
            <LandingCard
              findDuo={findDuo}
              duoFound={duoFound}
              imgSrc={loggedUserContext?.loggedUser?.avatarImage}
            />
          {showChatButtons()}
            {getButton()}
          </Container>
          <Agent src={bgAgent2}></Agent>
        </LandingContent>
      </LandingPage>
    </>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 0%;
  width: 100%;
`;

const ButtonImages = styled.img`
  /* height: 100%; */
  filter: invert();
  width: 2%;
`;

const Button = styled.button`
  font-weight: bold;
  font-size: 1rem;
  /* height: 100%; */
  /* margin: 5%; */
  background: none;
  padding: 0% 10% 5% 10%;
  /* background: none; */
  color: white;
  border: 0px;
  width: 200px;
  :hover {
    cursor: pointer;
  }

  & #filterIcon {
    fill: white;
    width: 20px;
    height: 20px;
    line-height: 100%;
    padding-right: 5%;
    margin-bottom: -2.5%;
  }

  @media (max-width: 769px) {
    margin-top: 5%;
    font-size: 0.75rem;
  }


`;

const LandingPage = styled.div`
  background-color: #181818;
  margin: 0px;
  padding: 0px;
  min-height: 100vh;
  min-width: 100vw;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const Nav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
  padding-top: 1rem;
  transition: all 0.25s ease-in-out;

  @media (max-width: 769px) {
    position: static;
    flex-direction: column;
    justify-content: center;
    padding-top: 1.5rem;
  }
`;

const Logo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  position: absolute;
  font-family: "valorant";

  left: 50%;
  transform: translateX(-50%);

  & #valorant {
    color: #f94b4b;
    font-size: 2rem;
    margin: 0px;
    padding-bottom: 5px;
    font-weight: 200;
    transition: all 0.5s ease-in-out;

    @media (max-width: 769px) {
      font-size: 1.35rem;
    }

    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }

  & #duofinder {
    color: white;
    font-size: 3rem;
    margin: 0px;
    padding: 0px;
    font-weight: 200;
    transition: all 0.5s ease-in-out;

    @media (max-width: 769px) {
      font-size: 2rem;
    }
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  @media (max-width: 769px) {
    position: static;
    transform: translateX(0);
  }
`;

const UserDiv = styled.div`
  margin-left: auto;
  padding-right: 2rem;
  cursor:pointer;
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  font-weight: 300;

  @media (max-width: 769px) {
    padding-right: 0;
    margin: 2.5% auto;
  }
`

const User = styled.div`
  display: flex;
  flex-direction: row;
  transition: all 0.25s ease-in-out;

  @media (max-width: 769px) {
    font-size: 0.75rem;
  }

  & #username {
    color: white;
    padding-right: 0.5rem;
  }

  & #profilePic {
    border: none;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background-color: #425852;
    @media (max-width: 769px) {
      height: 40px;
      width: 40px;
    }
  }
`;

const StopLogout = styled.button`
  color:white;
  background:transparent;
  border: none;
  transition:0.5s all;
  &:hover{
    cursor:pointer;
    color: #f94b4b;
  }
`

const Logout = styled.button`
    background-color:transparent;
    color:white;
    border:none;
    border-radius: 3px;
    transition: 0.5s all;
    cursor:pointer;
    height:56px;

    &:hover{
      color: #f94b4b;
    } 
`

const LandingContent = styled.div`
  display: flex;
  flex: row;
  justify-content: space-evenly;
  height: 80vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const FindDuo = styled.button`
  background-color: #66c2a9;
  border: none;
  border-radius: 8px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 1em;
  padding: 10px 20px;
  transition: 0.5s;

  display: flex;
  flex-direction: row;
  width: 150px;

  &:hover {
    box-shadow: 0 0 7.5px #66c2a9;
    cursor: pointer;
  }

  & #magnifyingGlass {
    fill: white;
    width: 16px;
    height: 16px;
    padding: 3px 10px 5px 0px;
  }

  @media (max-width: 769px) {
    margin: 5%;
  }
`;

const Cancel = styled.button`
  background-color: #66c2a9;
  border: none;
  border-radius: 8px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 1em;
  padding: 10px 20px;
  transition: 0.5s;

  width: 150px;

  &:hover {
    box-shadow: 0 0 7.5px #66c2a9;
    cursor: pointer;
  }
  @media (max-width: 769px) {
    margin: 5%;
  }
`;

const HistoryButtonWrapper = styled.div`
  margin-left: 15px;
`;

const History = styled.div`
  display: flex;
  flex-direction: row;
`;

const HistoryLink = styled.div`
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  background: none;
  padding: 0% 10% 5% 10%;
  line-break: 100%;
  border: 0px;
  width: 200px;

  & #historyIcon {
    fill: white;
    width: 20px;
    height: 20px;
    line-height: 100%;
    padding-right: 5%;
    margin-bottom: -2.5%;
  }

  @media (max-width: 769px) {
    font-size: 0.75rem;
    margin-top: 5%;
  }
`;

const Agent = styled.img`
  filter: brightness(35%) drop-shadow(0 0 7.5px #66c2aa6c);
  width: 20vw;
  height: 80vh;
  object-fit: cover;

  visibility: visible;
  opacity: 100;
  transition: visibility 1s, opacity 1s;

  @media (max-width: 1024px) {
    visibility: hidden;
    opacity: 0;
    transition: visibility 1s, opacity 1s;
  }
`;
function navigate(arg0: string) {
  throw new Error("Function not implemented.");
}

