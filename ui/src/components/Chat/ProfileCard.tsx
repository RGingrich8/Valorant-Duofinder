import * as React from "react";
import styled from "styled-components";

interface Props {
    imgSrc: string;
    userName: string;
    valRank?: number;
    valRankLvl?: number;
    chatRank: string;
    basicInfo?: string;
    userType: number;
    aboutMe?: string;
}

export default function ProfileCard(props: Props): React.ReactElement<Props, any> {
    return (
        <Wrapper>
            <Icon imgSrc={props.imgSrc} />
            <Username>{props.userName}</Username>
            <BasicInfo>{props.basicInfo}</BasicInfo>
            <Ranks>
                <RankLabel>
                    <RankImg imgSrc={"/images/ranks/rank_"+props.valRank+"_"+props.valRankLvl+".webp"} />
                    RANK
                </RankLabel>
                <RankLabel style={{ textAlign: "center" }}>
                    <RankImg imgSrc={props.chatRank} />
                    REPUTATION
                </RankLabel>
            </Ranks>
            <AboutContainer>
                <Label>ABOUT ME:</Label>
                <AboutMe>{props.aboutMe}</AboutMe>
            </AboutContainer>
        </Wrapper>
    );
}

const Wrapper = styled("div")`
  background-color: #282828;
  margin: 10px;
  width: 20vw;
  max-width: 400px;
  height: 70vh;
  padding: 5vh;
  border-radius: 44px;
  filter: drop-shadow(0px 0px 10px #66c2a9);
  display: flex;
  flex-direction: column;
  overflow: scroll;
  justify-content: center;
  @media all and (max-width: 1400px) {
    margin-left: auto;
    margin-right: auto;
    order: 1;
    flex-wrap: wrap;
    width: 90vw;
    max-width: 90vw;
    height: 13vh;
    padding: 2vw;
    filter: drop-shadow(0px 0px 5px #66c2a9);
    max-height: 200px;
    border-radius: 20px;
  }
  @media all and (max-height: 1000px) {
    min-height: 10vw;
  }
`;

const Icon = styled.img<{ imgSrc: string }>`
  content: url(${(props) => props.imgSrc});
  border-radius: 50%;
  width: 10vw;
  max-width: 200px;
  max-height: 200px;
  aspect-ratio: 1;
  margin-left: auto;
  margin-right: auto;
  display: block;
  @media all and(max-height: 1000px) {
    width: 10%;
    height: 10%;
  }
`;
const Username = styled.p`
  text-align: center;
  font-size: min(3vw, 25px);
  margin: 5px;
  font-weight: 600;
`;
const BasicInfo = styled.p`
  text-align: center;
  font-size: min(15px, 2vw);
  font-weight: 400;
  margin: 0;
  @media all and (max-width: 1400px) {
    display: none;
  }
`;
const Ranks = styled.div`
  display: flex;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  justify-content: space-between;
  @media all and (max-width: 1400px) {
    flex-direction: column;
    width: 10%;
    justify-content: center;
    margin-top: auto;
    margin-bottom: auto;
  }
`;
const RankImg = styled.img<{ imgSrc: string }>`
  content: url(${(props) => props.imgSrc});
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  width: 5vw;
  max-width: 50px;
  height: 5vw;
  max-height: 50px;
  @media all and(max-height: 1000px) {
    height: 10%;
    max-height: 10%;
  }
`;

const AboutContainer = styled.div`
  text-align: left;
  overflow: scroll;
  margin-left: auto;
  margin-right: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none;    /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
  @media all and (max-width: 1400px) {
    width: 40%;
    height: 90%;
  }
`;

const AboutMe = styled.p`
  font-size: min(3vw, 20px);
  font-weight: 400;
  font-family: "Arimo", sans-serif;
  margin: 0;
`;
const Label = styled.p`
  text-align: left;
  font-size: min(20px, 1.2vw);
  font-weight: 600;
  @media all and (max-width: 1400px) {
    margin: 0;
  }
`;
const RankLabel = styled(Label)`
  text-align: center;
  font-size: 60%;
  display: flex;
  flex-direction: column;
  @media all and (max-width: 1400px) {
    font-size: 30%;
  }
`;
