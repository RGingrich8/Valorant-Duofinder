import React, { useContext } from "react";
import styled from "styled-components/macro";
import { WidthContext } from "./ChatHistory";

interface Props {
    imgSrc: string;
    userName: string;
    valRank?: string;
    chatRank: string;
    userType: string;
    aboutMe?: string;
    isMain?: boolean;
}

export default function ProfileCardUpdated(props: Props): React.ReactElement<Props, any> {
    const width = useContext(WidthContext);

    return (
        <Wrapper isMain={props.isMain}>
            <UserImageContainer>
                {width > 500 && <UserIcon imgSrc={props.imgSrc} />}
                <div>
                    <UsernameText>{props.userName}</UsernameText>
                </div>
                <RanksContainer>
                    <RankWrapper>
                        <RankImg imgSrc={props.valRank} />
                        <RankLabel>RANK</RankLabel>
                    </RankWrapper>
                    <RankWrapper>
                        <RankImg imgSrc={props.chatRank} />
                        <RankLabel style={{ textAlign: "center" }}>REP</RankLabel>
                    </RankWrapper>
                </RanksContainer>
            </UserImageContainer>

            {width > 500 && (
                <AboutMeContainer>
                    <AboutMeLabel>ABOUT ME:</AboutMeLabel>
                    <AboutMeWrapper>
                        <AboutMeText>{props.aboutMe}</AboutMeText>
                    </AboutMeWrapper>
                </AboutMeContainer>
            )}
        </Wrapper>
    );
}

const Wrapper = styled("div")<{ isMain?: boolean }>`
    position: relative;
    background-color: #282828;
    border-radius: 44px;
    filter: drop-shadow(0px 0px 10px #66c2a9);

    font-weight: 200;
    font-size: 15px;
    text-align: center;

    @media all and (min-width: 1000px) {
        aspect-ratio: 44/79;
    }

    padding: 5%;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    overflow: hidden;

    p {
        margin: 0;
    }

    @media all and (max-width: 1000px) {
        /* height: 100%; */
        /* width: 100%; */

        border-radius: 20px;

        padding: 2%;

        order: 1;
        flex-wrap: wrap;

        filter: ${(props) => (props.isMain ? "drop-shadow(0px 0px 5px #66c2a9)" : "none")};
    }

    @media all and (max-width: 500px) {
        height: 100%;
        width: 100%;
        filter: none;
        flex-direction: row;
    }
`;

const UserImageContainer = styled.div`
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 40%;

    @media all and (max-width: 500px) {
        width: 50%;
        height: 100%;
    }
`;

const UserIcon = styled.img<{ imgSrc: string }>`
    position: relative;
    content: url(${(props) => props.imgSrc});
    aspect-ratio: 1/1;

    max-width: 200px;
    max-height: 200px;

    border-radius: 50%;
    display: block;

    margin-bottom: 5px;
    margin-left: auto;
    margin-right: auto;

    @media all and (max-width: 500px) {
        width: 25%;
        margin-bottom: 5%;
    }
`;

const UsernameText = styled.p`
    font-size: 2rem;

    && {
        margin-bottom: 5%;
    }

    @media all and (max-width: 500px) {
        font-size: 1.5em;
    }
`;

const RanksContainer = styled.div`
    position: relative;

    display: flex;
    justify-content: center;
    gap: 10%;

    width: 100%;

    margin-bottom: 5%;

    @media all and (max-width: 500px) {
        width: 100%;
        height: 30%;
    }
`;
const RankImg = styled.img<{ imgSrc: string }>`
    content: url(${(props) => props.imgSrc});

    position: relative;

    justify-content: center;

    width: 5vw;
    max-width: 54px;
    height: 5vw;
    max-height: 54px;

    aspect-ratio: 1/1;

    @media all and (max-width: 500px) {
        min-width: 50px;
        min-height: 50px;
    }
`;

const AboutMeContainer = styled.div`
    position: relative;
    height: 40%;
    @media all and (max-width: 1000px) {
        width: 40%;
        height: 90%;
    }

    @media all and (max-width: 500px) {
        width: 40%;
        height: 90%;
    }
`;

const AboutMeLabel = styled.p`
    text-align: left;
    font-size: 1.5rem;
    font-weight: 600;
`;

const AboutMeWrapper = styled.div`
    height: 90%;
    overflow-y: scroll;
`;

const AboutMeText = styled.p`
    position: relative;
    padding: 2%;

    text-align: left;
    font-size: 1rem;
    font-weight: 400;
    font-family: "Arimo", sans-serif;
`;

const RankLabel = styled(AboutMeLabel)`
    text-align: center;
    font-size: min(20px, 1.5vw);
    display: flex;
    flex-direction: column;

    @media all and (max-width: 500px) {
        font-size: 1rem;
    }
`;

const RankWrapper = styled.div``;
