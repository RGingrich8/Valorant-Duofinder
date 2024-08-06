import * as React from "react";
import styled from "styled-components";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { MatchedUserContext } from "../../contexts/MatchedUserContext";

export default function MatchFound() {
  // Contexts
  const loggedUserContext = useContext(LoggedUserContext);
  const matchedUserContext = useContext(MatchedUserContext);

  // State
  const [countdown, setCountdown] = useState(3);

  /* Navigation */
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      // Use setTimeout to schedule an update to the countdown state
      // every 1 second. When the countdown reaches 0, clear the
      // timeout so the interval stops.
      const timeout = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setTimeout(() => {
        navigate("../chat");
      }, 1000);
    }
  }, [countdown]);

  return (
    <>
      <MatchContainer>
        <MatchFoundText>Match Found</MatchFoundText>
        <FindDuoContainer>
          <ProfileDiv>
            <Teammate
              icon={loggedUserContext?.loggedUser?.avatarImage}
            ></Teammate>
            <Username>
              {loggedUserContext?.loggedUser?.displayName ?? "<username 1>"}
            </Username>
          </ProfileDiv>

          <CountDownText>{countdown}</CountDownText>
          <ProfileDiv>
            <Teammate
              icon={matchedUserContext?.matchedUser?.avatarImage}
            ></Teammate>
            <Username>
              {matchedUserContext?.matchedUser?.displayName ?? "<username 2>"}
            </Username>
          </ProfileDiv>
        </FindDuoContainer>
      </MatchContainer>
    </>
  );
}

const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 0;
`;

const ProfileDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const MatchFoundText = styled.p`
  font-family: "valorant";
  font-size: 2.8vw;
  margin: 0;

  @media (max-width: 769px) {
    margin-bottom: 5%;
  }
`;

const Username = styled.p`
  margin-bottom: 0;
  font-size: 1rem;

  @media (max-width: 769px) {
    margin-top: 5%;
  }
`;

const CountDownText = styled.p`
  color: #f94b4b;
  font-size: 5vw;
  width: 5vw;
  font-family: "valorant";
  margin: 0;

  @media (max-width: 769px) {
    margin: 7.5% 0;
  }
`;

const Teammate = styled.img<{ icon: string }>`
  height: 9rem;
  width: 9rem;
  background: url(${(props) => props.icon});
  background-size: contain;
  background-repeat: no-repeat;

  display: flex;
  flex-direction: column;
  justify-content: center;

  border-color: rgb(102, 194, 169, 0.5);
  border-radius: 50%;
  border: 5px solid #66c2a9;

  z-index: 4;
  transition: all 0.5s ease-in-out;
  background-color: #266152;

  @media (max-width: 1025px) {
    height: 7rem;
    width: 7rem;
  }
  @media (max-width: 769px) {
    height: 6rem;
    width: 6rem;
  }
`;

const FindDuoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2.5% 10%;

  @media (max-width: 769px) {
    flex-direction: column;
    justify-content: center;
    padding: 5% 0;
  }
`;
