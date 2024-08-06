import styled from "styled-components";
import * as React from "react";

interface Props {
  msgType: string; //recieved or sent
  text: string;
  senderImg: string;
}

export default function MessageContainer(props: Props) {
  return (
    <Wrapper msgType={props.msgType}>
      <Icon msgType={props.msgType} imgSrc={props.senderImg} />
      <ChatBubble msgType={props.msgType}>{props.text}</ChatBubble>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ msgType: string }>`
  display: flex;
  margin: 10px;

  justify-content: ${(props) =>
    props.msgType === "received" ? "start" : "end"};
`;

const ChatBubble = styled.div<{ msgType: string }>`
  background-color: ${(props) =>
    props.msgType === "received" ? "#66c2a9" : "#FFFFFF"};
  order: ${(props) => (props.msgType === "received" ? 2 : 1)};
  max-width: 500px;
  padding: 1vw;
  border-radius: 20px;
  color: black;
  font-family: "Arimo", sans-serif;
  font-size: min(2vw, 20px);
  box-shadow: 0px 5px 6px #546466;
  @media all and (max-width: 1400px){
    padding: 2.5vw;
    font-size: max(1.5vw,12px);
    border-radius: 20px;
  }
`;

const Icon = styled.img<{ imgSrc: string; msgType: string }>`
  content: url(${(props) => props.imgSrc});
  border-radius: 50%;
  width: 6vh;
  height: 6vh;
  margin: 5px;
  max-width: 200px;
  max-height: 200px;
  aspect-ratio: 1;
  order: ${(props) => (props.msgType === "received" ? 1 : 2)};
  @media all and (max-width: 1400px) {
    
  }
  @media all and (max-width: 800px){
    display: none;
  }
`;
