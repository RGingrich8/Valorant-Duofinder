import * as React from "react";
import styled from "styled-components";
import Profile from "./Profile";
import FindDuo from "./FindDuo";
import MatchFound from "./MatchFound";

type Props = {
  findDuo: boolean;
  duoFound: boolean;
  imgSrc: string;
};

export default function LandingCard(props: Props) {
  /* Helper Functions */

  const displayCard = () => {
    if (!props.findDuo) {
      return <Profile></Profile>;
    } else if (props.findDuo && !props.duoFound) {
      return <FindDuo></FindDuo>;
    } else if (props.findDuo && props.duoFound) {
      return <MatchFound></MatchFound>;
    }
  };

  return <Card>{displayCard()}</Card>;
}

const Card = styled.div`
  background-color: #282828;
  margin: 5%;
  width: 50vw;
  height: 55vh;

  border-radius: 46px;
  box-shadow: 0 0 7.5px #66c2a9;
  text-align: center;
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  @media (max-width: 769px) {
    width: 380px;
    height: 65vh;
  }
`;
