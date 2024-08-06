import React, { createContext, useContext, useEffect, useState } from "react";
import Button from "../Shared/Button";
import styled from "styled-components/macro";
import { EmblaCarousel } from "./EmblaCarousel";
import ProfileCardUpdated from "./ProfileCardUpdated";
import { Slider } from "@mui/material";
import { CommendationService } from "../../services/CommendationService";
import { LoggedUserContext } from '../../contexts/LoggedUserContext';
import { CustomToast } from "../Shared/CustomToast";
import { toast } from "react-toastify";
import { IUser } from "../../models/AuthModels";
import { MatchingService, IMatchingResponse } from '../../services/MatchingService';
import { ILoadMsgDTO, IMessage } from "../../models/ChatModels";
import MessageContainer from "./MessageContainer";
import { IChatResponse, ChatService } from '../../services/ChatService';
import { Micellaneous } from "../../util/Micellaneous";

type Props = {};

const SLIDE_COUNT = 5;
const slides = Array.from(Array(SLIDE_COUNT).keys());

export const WidthContext = createContext<number>(1500);

export interface IHistoryEntry{
  key : number;
  user : IUser;
}

function ChatHistory(props: Props): React.ReactElement {
  
  // Constants
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 1000;
  const marks = [{value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'},
                 {value: 4, label: '4'}, {value: 5, label: '5'}, {value: 6, label: '6'},
                 {value: 7, label: '7'}, {value: 8, label: '8'}, {value: 9, label: '9'},
                 {value: 10, label: '10'}];

  // Contexts
  const loggedUserContext = useContext(LoggedUserContext);

  // State
  const [rateState, setRateState] = useState(0);
  const [rating, setRating] = useState(5);
  const [history, setHistory] = useState<IHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<IHistoryEntry[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [main, setMain] = useState<number>(0)
  const [filter, setFilter] = useState<string>("");

  // Use Effects 
  React.useEffect(() => {

    const fetchMatchHistory = async () : Promise <void> => {

      const res : IMatchingResponse = await MatchingService.retrieveHistory(loggedUserContext?.loggedUser?._id);

      if(res.statusCode !== 200){
        toast.error("Could not retrieve match history.")
        return;
      }

      setHistory((res.data as IUser[]).map( (user : IUser, index : number) => {
          return {key: index, user : user};
      }));

      setFilteredHistory((res.data as IUser[]).map( (user : IUser, index : number) => {
        return {key: index, user : user};
      }));
    }

    fetchMatchHistory();

  }, []);

  React.useEffect(() => {

    const fetchMessages = async () : Promise<void> => {

      const res : IChatResponse = await ChatService.retrieve({senderId : loggedUserContext?.loggedUser?._id, receiverId : history[main]?.user?._id});

      if(res.statusCode !== 200){
        toast.error("Could not retrieve chat for match.")
        return;
      }
      const loadedMessages = res.data as ILoadMsgDTO[];

      // Update messages to be displayed
      setMessages(loadedMessages.map( (loadMessage : ILoadMsgDTO) => {
        return {userId: loadMessage.senderId, 
         type: (loadMessage.senderId === loggedUserContext?.loggedUser?._id ?"sent":"received"), 
         text: loadMessage.message, 
         userIcon:loadMessage.senderId === loggedUserContext?.loggedUser?._id?loggedUserContext?.loggedUser?.avatarImage:history[main].user.avatarImage
        }
      }));
    }

    if(loggedUserContext.loggedUser && history[main]) fetchMessages();

  }, [loggedUserContext, history, main]);

  // Other Functions 

  function mainChanged(main : number){
    setMain(main);
  }

  function newRating() {
    setRateState(0);
  }

  function startRating() {
    setRateState(1);
  }

  function doneRating() {
    setRateState(2);
  }

  function handleRating(event: Event) {
    let newRating = (event.target as HTMLInputElement).value;
    setRating(+newRating);
  }

  async function commend() {

    const response = await CommendationService.save({commenderId:loggedUserContext?.loggedUser?._id, commendedId: history[main].user._id, score:rating})

    if(response.statusCode !== 200){
      toast.error(response.data as string);
      newRating();
    }else{
      doneRating();
    }
  }

  function displayRating() {
    if (rateState === 0) {
      return <RateButton onClick={startRating}>RATE PLAYER</RateButton>;
    } else if (rateState === 1) {
      return (
        <RatingContainer>
          <label htmlFor="rating">RATE PLAYER</label>
          <CustomSlider
            size="small"
            defaultValue={5}
            min={1}
            max={10}
            step={1}
            marks={marks}
            valueLabelDisplay="off"
            onChange={(e: Event) => {
              handleRating(e);
            }}
          />
          <Commend type="button" onClick={commend}>
            COMMEND
          </Commend>
        </RatingContainer>
      );
    } else if (rateState == 2) {
      return <h4>Rating Recorded!</h4>;
    }
  }

  function handleFilter(e : any){
    console.log(e.target.value);
    setFilter(e.target.value);
  }

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResizeWindow);

    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  });

  useEffect(() => {
    const newHistory = history.filter( (entry : IHistoryEntry) => {
      if(filter === "") return entry;
      if(entry.user.displayName.includes(filter)) return entry;
    });
    setFilteredHistory(newHistory);
  }, [filter]);

  function navigate(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
     <CustomToast></CustomToast>
      <WidthContext.Provider value={width}>
        <MainWrapper>
          <MainContainer>
            <HistorySection>
              <Menu>
                {width > breakpoint && (
                  <Button
                    text={"BACK"}
                    width={"160px"}
                    height={"70px"}
                    url={'../landing'}
                    img_url={null}
                    svg={true}
                  ></Button>
                )}
                {width > breakpoint && (
                  <SearchContainer>
                    <SearchIconWrapper>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->  */}
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/>
                      </svg>
                      {/* <SearchIcon url={"images/general/search.png"} /> */}
                    </SearchIconWrapper>
                    <SearchInput onChange={handleFilter} placeholder="Search Message History" />
                  </SearchContainer>
                )}
              </Menu>

              <PlayerCardsWrapper>
                <EmblaCarousel
                  slides={[...slides]}
                  history={filteredHistory}
                  ClickHandler={newRating}
                  mainChanged={mainChanged}
                />
                {width < breakpoint && (
                  <RatePlayerWrapper>
                    <Button
                      fontSize="2em"
                      text={"BACK"}
                      width={'auto'}
                      height={"100%"}
                      url={'../landing'}
                    />
                  </RatePlayerWrapper>
                )}
              </PlayerCardsWrapper>

              <ChatContainer>
                    {messages.map((msg: IMessage, index: number) => (
                      <MessageContainer
                        key={msg.userId + index.toString()}
                        msgType={msg.type}
                        senderImg={msg.userIcon}
                        text={msg.text}/>
                    ))}
              </ChatContainer>
            
            </HistorySection>

            {width > breakpoint && (
              <InfoCardSection>
                <RatePlayerWrapper>{displayRating()}</RatePlayerWrapper>
                <ProfileCardWrapper>
                  <ProfileCardUpdated
                    imgSrc= {history[main]?.user?.avatarImage}
                    userName={history[main]?.user?.displayName}
                    chatRank="images/reputation_ranks/ToxicWaste.png"
                    userType={Micellaneous.playerTypeToString(history[main]?.user?.playerType)}
                    valRank={`images/ranks/rank_${history[main]?.user?.rank[0]}_${history[main]?.user?.rank[1]}.webp`}
                    aboutMe={history[main]?.user?.aboutMe}
                  ></ProfileCardUpdated>
                </ProfileCardWrapper>
              </InfoCardSection>
            )}
          </MainContainer>
        </MainWrapper>
      </WidthContext.Provider>
    </>
  );
}

const RateButton = styled.button`
  color: white;
  background-color: #68c9ac;
  border: none;
  border-radius: 10px;
  width: 160px;
  height: 70px;
  font-size: 16px;
  transition: 0.5s all;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px #68c9ac;
    cursor: pointer;
  }
`;

const Commend = styled.button`
  color: white;
  background-color: #68c9ac;
  border: none;
  border-radius: 2px;
  width: 40%;
  margin-top: 2%;

  &:hover {
    cursor: pointer;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  justify-content: space-between;
  align-items: center;
`;

const CustomSlider = styled(Slider)`

  margin: 3% 0;

    & .MuiSlider-thumb {
      background-color: #BD3944;
      height: 0.8vw;
      width: 0.3vw;
      border-radius: 0;
    }

    & .MuiSlider-rail {
      color: #D9D9D9;
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
    }

    & 	.MuiSlider-markLabel{
      color: white;
    }
`;

const MainWrapper = styled.div`
  // applies it to all the children
  * {
    box-sizing: border-box;
    font-family: "Arimo";
  }
  font-weight: 200;
  font-size: 15px;
  display: flex;
  justify-content: center;

  height: 100vh;
  width: 100vw;
`;

const MainContainer = styled.main`
  position: inherit;
  max-width: 1500px;
  width: 100%;

  padding: 2%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  @media all and (max-width: 1000px) {
    flex-direction: column-reverse;
    padding: 5%;
  }
`;

const HistorySection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  height: 100%;

  @media all and (max-width: 1000px) {
    height: 100%;
    width: 100%;
  }
`;

const InfoCardSection = styled.aside`
  position: relative;
  width: 37%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const ProfileCardWrapper = styled.div`
  position: inherit;
  height: 85%;
  width: 100%
`;

const Menu = styled.nav`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const RatePlayerWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: start;

  width: 100%;
  margin-bottom: 4%;

  @media all and (max-width: 500px) {
    position: relative;
    width: 20%;
    height: 20%;
  }
`;

const PlayerCardsWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 30%;

  // Split screen
  @media all and (max-width: 1000px) {
    height: 40%;
    flex-direction: column;
  }

  // Mobile
  @media all and (max-width: 500px) {
    height: 30%;
    flex-direction: column;
  }
`;

const ChatContainer = styled.div`
  overflow-y: scroll;
  margin: 10px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  width: 100%;
  height: 70%;
  padding: 5%;
  outline: 1px red;
  background-color: #282828;
  border-radius: 44px;
  display: flex;
  flex-direction: column;
  justify-content: start;

  @media all and (max-width: 500px) {
    height: 80%;
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  width: 40%;
  height: 40px;

  top: 1px;
  right: 1px;

  display: flex;
  align-items: center;

  background: #282828;

  border-radius: 44px;
`;

const SearchInput = styled.input`
  position: relative;
  background: none;
  flex-grow: 1;
  border: none;

  color: white;

  // increase specificity
  && {
    font-family: "Arimo";
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 22px;
    text-decoration-color: blue;
    text-align: left;
  }

  && :focus,
  :focus {
    outline: none;
  }

  /* identical to box height */
`;

const SearchIconWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;


  & svg{
    fill: white;
    width: 1vw;
    height: 1vw;
  }

`;

const SearchIcon = styled.img<{ url: string }>`
  position: relative;
  height: 50%;
  font-style: normal;
  & * {
    font-weight: 700;
    font-size: 26px;
    line-height: 30px;
    text-align: center;

    color: #ffffff;
  }
  aspect-ratio: 1;

  content: url(${(props) => props.url});
`;

export default ChatHistory;
