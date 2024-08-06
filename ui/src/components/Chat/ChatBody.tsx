import * as React from "react";
import styled from "styled-components";
import ProfileCard from "./ProfileCard";
import MessageContainer from "./MessageContainer";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../contexts/SocketContext";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { Link } from "react-router-dom";
import { MatchedUserContext } from "../../contexts/MatchedUserContext";
import { ILoadMsgDTO, IMessage, IReceiveMsgDTO } from "../../models/ChatModels";
import { Gender } from "../../models/FiltersModels";
import { EnvConfig } from "../../util/EnvConfig";
import { ChatService, IChatResponse } from "../../services/ChatService";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "react-toastify";

export default function ChatBody() {
  // Contexts
  const loggedUserContext = useContext(LoggedUserContext);
  const matchedUser = useContext(MatchedUserContext);
  const socketContext = useContext(SocketContext);

  // State
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState("");


  // Use State
  useEffect(() => {

    const fetchMessages = async () : Promise<void> => {

      const res : IChatResponse = await ChatService.retrieve({senderId : loggedUserContext?.loggedUser?._id, receiverId : matchedUser?.matchedUser?._id});

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
         userIcon:loadMessage.senderId === loggedUserContext?.loggedUser?._id?loggedUserContext?.loggedUser?.avatarImage:matchedUser?.matchedUser?.avatarImage
        }
      }));
    }

    if(localStorage.getItem("loggedUser") && localStorage.getItem("matchedUser")) fetchMessages();

  }, []);

  useEffect(() => {
    socketContext?.socket?.on("receive_msg", (receiveMsgDTO: IReceiveMsgDTO) => {
      // Locally update the messages
    
      const newMsgs = [...messages, {userId: matchedUser?.matchedUser?._id,type:"received", text:receiveMsgDTO.msg, userIcon:matchedUser?.matchedUser?.avatarImage}];
      setMessages(newMsgs);
    });

    socketContext?.socket?.on("error_send_msg", (msg: any) => {
      if (EnvConfig.DEBUG) console.log(msg);
    });
  }, [
    matchedUser?.matchedUser?._id,
    matchedUser?.matchedUser?.avatarImage,
    messages,
    socketContext.socket,
  ]);

  const sendMsg = async (sendContactInfo: boolean = false) => {
    const contactMsg = `You wanna play? Let's play! Add me on Valorant! ${loggedUserContext?.loggedUser?.gameName}#${loggedUserContext?.loggedUser?.tagLine}`;
  
    // Locally update the messages
    const newMsgs = [
      ...messages,
      {
        userId: loggedUserContext?.loggedUser?._id,
        type: "sent",
        text: sendContactInfo ? contactMsg : typedMessage,
        userIcon: loggedUserContext?.loggedUser?.avatarImage,
      },
    ];
    setMessages(newMsgs);
    
    // Store the message in the database
    await ChatService.save({senderId:loggedUserContext?.loggedUser?._id, receiverId:matchedUser?.matchedUser?._id, message: typedMessage});

    // Notify other users of the message
    socketContext?.socket?.emit("send_msg", matchedUser?.matchedUser?._id, sendContactInfo ? contactMsg : typedMessage);

    setTypedMessage("");  // Clear the typed message
  };

  const updateMsg = (e: any) => {
    setTypedMessage(e.target.value);
  };

  function navigate(arg0: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <Wrapper>
      <Link onClick={() => { localStorage.removeItem("matchedUser") } } to={"/landing"}>
        {" "}
        <Exit />
      </Link>

      <LeftColContainer>
        <Timer> 🕐 You have 10 minutes remaining! </Timer>

        <ChatBox>
          {messages.map((msg: IMessage, index: number) => (
            <MessageContainer
              key={msg.userId + index.toString()}
              msgType={msg.type}
              senderImg={msg.userIcon}
              text={msg.text}
            />
          ))}
        </ChatBox>

        <ChatInputContainer>
          <ChatInput
            value={typedMessage}
            placeholder="Message"
            onChange={updateMsg}
          ></ChatInput>

          <ChatBtn onClick={() => sendMsg()}>SEND</ChatBtn>
        </ChatInputContainer>
      </LeftColContainer>

      <RightColContainer>
        <TopText>You're chatting with:</TopText>
        <ProfileCard
          imgSrc={
            matchedUser.matchedUser == null
              ? "/images/icons/Jett_icon.webp"
              : matchedUser.matchedUser.avatarImage
          }
          userName={
            matchedUser.matchedUser == null
              ? "HectorSalamanca"
              : matchedUser.matchedUser.displayName
          }
          basicInfo={
            matchedUser.matchedUser == null
              ? "22F, US West"
              : matchedUser.matchedUser.age +
                " " +
                Gender[matchedUser.matchedUser.gender]
          }
          userType={
            matchedUser.matchedUser == null
              ? 0
              : matchedUser.matchedUser.playerType
          }
          valRank={
            matchedUser.matchedUser == null
              ? 6
              : matchedUser.matchedUser.rank[0]
          }
          valRankLvl={
            matchedUser.matchedUser == null
              ? 1
              : matchedUser.matchedUser.rank[1]
          }
          chatRank="/images/reputation_ranks/ToxicWaste.png"
          aboutMe={
            matchedUser.matchedUser == null
              ? "This is the about me section."
              : matchedUser.matchedUser.aboutMe
          }
        />

        <BtnContainer>
          <MobileTimer>🕐 You have 10 minutes remaining!</MobileTimer>
          <Btn onClick={() => sendMsg(true)} btnColor="#66c2a9">
            <BtnIcon imgSrc="/images/chat/share.png" />
            SHARE CONTACT
          </Btn>
          <Btn onClick={() => { localStorage.removeItem('matchedUser'); navigate('../landing'); }} btnColor="#f94b4b">
            <BtnIcon imgSrc="/images/chat/gonext.png" />
            <Link
              to="/landing"
              style={{ color: "#ffffff", textDecoration: "none" }}
            >
              {" "}
              GO NEXT
            </Link>
          </Btn>
        </BtnContainer>
      </RightColContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  padding: 5px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Exit = styled.img`
  content: url("images/chat/x.png");
  width: 1vw;
  height: 1vw;
  min-width: 15px;
  min-height: 15px;
  position: absolute;
  right: 1px;
  padding: 1%;
  cursor: pointer;
  z-index: 1;
`;

const RightColContainer = styled.div`
  justify-content: center;
  text-align: center;
  font-size: min(5vw, 20px);
  @media all and (max-width: 1400px) {
    width: 100vw;
    height: 30vh;
    padding: 0;
    border-radius: 20px;
    background-color: #181818;
  }
`;
const LeftColContainer = styled.div`
  margin-right: 30px;
  align-items: center;
  @media all and (max-width: 1400px) {
    order: 1;
    margin-right: 0;
    padding: 0;
    margin: 0;
  }
`;

const TopText = styled.p`
  justify-content: center;
  text-align: center;
  font-size: min(5vw, 20px);
  @media all and (max-width: 1400px) {
    font-size: min(5vw, 15px);
  }
`;
const Timer = styled.p`
  justify-content: center;
  text-align: center;
  font-size: min(5vw, 20px);
  @media all and (max-width: 1400px) {
    font-size: min(2vw, 15px);
    display: none;
  }
`;

const MobileTimer = styled.p`
  justify-content: center;
  text-align: center;
  font-size: min(5vw, 20px);
  display: none;
  @media all and (max-width: 1400px) {
    font-size: min(1.5vh, 15px);
    max-width: 50vw;
    text-align: left;
    display: block;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  @media all and (max-width: 1400px) {
    margin: 20px;
  }
`;

const BtnIcon = styled.img<{ imgSrc: string }>`
  content: url(${(props) => props.imgSrc});
  width: 4vw;
  max-width: 20px;
  height: 4vw;
  max-height: 20px;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
`;

const Btn = styled.div<{ btnColor: string }>`
  background-color: ${(props) => props.btnColor};
  width: 8vw;
  min-width: 150px;
  font-weight: 600;
  height: 6vh;
  font-size: min(2vw, 15px);
  border-radius: 20px;
  justify-content: center;
  margin: 20px;
  padding: 0.5%;

  cursor: pointer;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0px 0px 10px ${(props) => props.btnColor});
  }
  @media all and (max-width: 1400px) {
    font-size: 40%;
    min-width: 70px;
    height: auto;
    padding: 5px;
    margin: 10px;
    border-radius: 10px;
  }
`;
const ChatInputContainer = styled.div`
  background-color: #182828;
  width: 100%;
  height: 6vh;
  margin-top: 20px;
  border-radius: 20px;
  color: #dedbdb;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media all and (max-width: 1400px) {
    width: 90vw;
    height: 5vh;
    margin-top: 0;
    padding: 1vh;
  }
`;
const ChatInput = styled.input`
  background-color: #282828;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  color: #dedbdb;
  font-family: "Arimo", sans-serif;
  font-size: 20px;
  justify-content: center;
  display: block;
  outline: none;
  border: 0;
  position: absolute;
  box-sizing: border-box;
  padding: 2%;

  @media all and (max-width: 1400px) {
    width: 90vw;
    height: 5vh;
    margin-top: 0;
    padding: 1vh;
  }
`;

const ChatBtn = styled.button.attrs({
  type: "submit",
})`
  text-align: center;
  color: #ffffff;
  background: none;
  font-family: "Arimo", sans-serif;
  font-size: 20px;
  right: 20px;
  border: 0;
  position: absolute;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    filter: drop-shadow(0px 0px 5px #ffffff);
  }
  @media all and (max-width: 1400px) {
    margin-top: 0;
    padding: 1vh;
    font-size: 80%;
  }
`;

const ChatBox = styled.div`
  background-color: #282828;
  border-radius: 44px;
  overflow-y: scroll;
  width: 55vw;
  height: 70vh;
  padding: 5vh;
  margin: 10px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: start;
  @media all and (max-width: 1400px) {
    width: 90vw;
    height: 50vh;
    padding: 1vh;
    order: 2;
    padding: 0;
    border-radius: 20px;
    background: none;
  }
`;
