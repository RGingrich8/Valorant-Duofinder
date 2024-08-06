import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { LoggedUserContext } from "../../contexts/LoggedUserContext";
import { GameMode, Gender } from "../../models/FiltersModels";
import { AuthService, IAuthResponse } from "../../services/AuthService";
import { Micellaneous } from "../../util/Micellaneous";

// Main User Homescreen
export default function Profile(): React.ReactElement {
  // Context
  const loggedUserContext = useContext(LoggedUserContext);

  // State
  const [generalEdit, setGeneralEdit] = useState(false);

  const [displayName, setDisplayName] = useState(
    loggedUserContext?.loggedUser?.displayName
  );
  const [age, setAge] = useState(loggedUserContext?.loggedUser?.age);
  const [gender, setGender] = useState(loggedUserContext?.loggedUser?.gender);
  const [playerType, setPlayerType] = useState(
    loggedUserContext?.loggedUser?.playerType
);
  const [aboutMe, setAboutMe] = useState(
    loggedUserContext?.loggedUser?.aboutMe
  );
  const [profilePic, setProfilePic] = useState(
    loggedUserContext?.loggedUser?.avatarImage
  );
  const [charRemaining, setCharRemaining] = useState(150);

  // Handlers
  const edit = async () => {

    let shouldSave = generalEdit;
    setGeneralEdit(!generalEdit);

    if(shouldSave){

      const newValues = {
        displayName: displayName,
        age: age,
        gender: gender,
        playerType: playerType,
        aboutMe: aboutMe,
        avatarImage: profilePic
      };
  
      const res : IAuthResponse = await AuthService.update({
        userId: loggedUserContext?.loggedUser?._id,
        ...newValues,
      });
  
      if(res.statusCode === 200){
        toast.success("Information updated succesfully.");
        return;
      }

      loggedUserContext.updateLoggedUser({
        ...loggedUserContext?.loggedUser,
        ...newValues,
      });     
    }
  };

  // Pick a new (random) profile pic, only if editing is enabled
  const changePfp = () => {
    if (generalEdit){
      setProfilePic(Micellaneous.getAgentIcon(0, true));
    }
  };

  const handleDisplayNameChange = (e: any) => {
    if (generalEdit) setDisplayName(e.target.value);
  };

  const handleGenderChange = (e: any) => {
    if (generalEdit) setGender(e.target.value);
  };

  const handleAgeChange = (e: any) => {
    if (generalEdit) setAge(e.target.value);
  };

  const handleAboutMeChange = (e: any) => {
    if (generalEdit) setAboutMe(e.target.value);
    let charRemaining = 150 - e.target.value.length;
    setCharRemaining(charRemaining);
  };

  const handlePlayerTypeChange = (e : any) => {
    if(generalEdit) setPlayerType(e.target.value);
  }

  return (
    <ProfilePage>
      <Edit
        genE={generalEdit}
        src="./images/general/edit.png"
        onClick={() => edit()}
      ></Edit>
      <GridContainer>
        <ProfileContainer>
          <Pfp
            genE={generalEdit}
            src={profilePic}
            onClick={() => changePfp()}
          ></Pfp>
          <PersonInfo>
            {/* <UsernameDiv> */}
              <Input
                style={{marginBottom:'10%'}}
                genE={generalEdit}
                placeholder={displayName ?? "Username"}
                autoComplete={"off"}
                maxLength={15}
                disabled={!generalEdit}
                onChange={handleDisplayNameChange}
              ></Input>
            {/* </UsernameDiv> */}

            <InfoInputs>
              <InfoInputsInner>
              <Age
                style={{width: 'auto', margin:'0 2%'}}
                genE={generalEdit}
                disabled={!generalEdit}
                type="number"
                placeholder={!age || age === 0?'--':`${age}`}
                value = {!age?18:age}
                min="18"
                max="99"
                onChange={handleAgeChange}
              ></Age>
              <Drops
                style={{margin:'0 2%'}}
                value={gender}
                genE={generalEdit}
                disabled={!generalEdit}
                onChange={handleGenderChange}
              >
                <option value={Gender.unknown}>{"Gender"}</option>
                <option value={Gender.woman}>
                  {Micellaneous.genderToString(Gender.woman, generalEdit)}
                </option>
                <option value={Gender.man}>
                  {Micellaneous.genderToString(Gender.man, generalEdit)}
                </option>
                <option value={Gender.nonBinary}>
                  {Micellaneous.genderToString(Gender.nonBinary, generalEdit)}
                </option>
              </Drops>
              <ServerPref> { Micellaneous.serverPreferenceToString(loggedUserContext?.loggedUser?.region)}</ServerPref>

              </InfoInputsInner>
              <Drops style={{display: 'block', marginLeft:'auto', marginRight:'auto', width: 'auto', marginTop:'5%'}} value={playerType} genE={generalEdit} disabled={!generalEdit} onChange={handlePlayerTypeChange}>
                <option value={GameMode.competitive}>{Micellaneous.playerTypeToString(GameMode.competitive)}</option>
                <option value={GameMode.casual}>{Micellaneous.playerTypeToString(GameMode.casual)}</option>
              </Drops>
            </InfoInputs>
          </PersonInfo>
        </ProfileContainer>

        <DetailsContainer>
          <BioContainer>
            <Label>ABOUT ME</Label>
            <TextArea
              onChange={handleAboutMeChange}
              value={aboutMe}
              genE={generalEdit}
              autoComplete="off"
              placeholder={"There's nothing here! Edit your profile to liven things up!"}
              disabled={!generalEdit}
              rows={6}
              maxLength={150}
            ></TextArea>
            <CharRemaining genE={generalEdit}>
              {charRemaining}/150
            </CharRemaining>
          </BioContainer>

          <RankInfo>
            <Ranks>
              <RankLabel>
                <Heading>REPUTATION</Heading>
                <RankImg imgSrc="/images/reputation_ranks/ToxicWaste.png"></RankImg>
              </RankLabel>
            </Ranks>
            <Ranks>
              <RankLabel></RankLabel>
              <Heading>RANK</Heading>
                <RankImg
                  imgSrc={loggedUserContext && loggedUserContext.loggedUser && loggedUserContext.loggedUser.rank?`images/ranks/rank_${loggedUserContext?.loggedUser?.rank[0]}_${loggedUserContext?.loggedUser?.rank[1]}.webp`:"images/ranks/rank_1_1.webp"}
                ></RankImg>
            </Ranks>
          </RankInfo>
        </DetailsContainer>
      </GridContainer>
    </ProfilePage>
  );
}

const ProfilePage = styled.div``;
const InfoInputs = styled.div`
  @media (max-width: 769px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const InfoInputsInner = styled.div`
   display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const CharRemaining = styled.p<{ genE: boolean }>`
  color: ${(props) => (props.genE ? "#4a4a4a" : "#282828")};
  font-size: 0.75rem;
  font-weight: 300;
  margin: 0 15% 0 auto;

  @media (max-width: 769px) {
    font-size: 0.5rem;
    margin-right: 5%;
  }
`;

const Heading = styled.p`
  margin-top: 0%;
  margin-bottom: 10%;
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  @media (max-width: 769px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 50%;
`;

const PersonInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10%;
  @media (max-width: 769px) {
    padding-top: 5%;
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 50%;
  @media (max-width: 769px) {
    width: 100%;

    flex-direction: column-reverse;
  }
`;

const BioContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: left;

  @media (max-width: 769px) {
    text-align: center;
  }
`;

const RankInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 35%;
  z-index: 2;

  @media (max-width: 769px) {
    margin: -19.25% 0 5% 0;

    justify-content: space-between;
  }
`;

const Drops = styled.select<{ genE: boolean }>`
  background-color: ${(props) => (props.genE ? "#383838" : "#282828")};
  -webkit-appearance: ${(props) => (props.genE ? "" : "none")};
  -moz-appearance: ${(props) => (props.genE ? "" : "none")};
  border: 0px;
  border-radius: 3px;
  color: white;
  text-align: center;
  height: 30px;
  width: ${(props) => (props.genE ? "75px" : "40px")};
  transition: 0.5s all;
  font-size: 0.75rem;
  margin-top: 2%;
  opacity: 100%;

  :focus {
    box-shadow: 0 0 5px #60d6b5;
    border: none;
    outline: none;
  }
  @media (max-width: 769px) {
    height: 20px;
    width: 40px;
    font-size: 0.5rem;
  }
`;

const Age = styled.input<{ genE: boolean }>`
  background-color: ${(props) => (props.genE ? "#383838" : "#282828")};
  border: 0px;
  border-radius: 3px;
  color: white;
  font-family: Arial;
  text-align: center;
  height: 28px;
  font-size: 0.75rem;
  font-weight: 200;
  transition: 0.5s all;
  padding:0;
  width: auto;
  ::placeholder {
    color: white;
  }
  :focus {
    box-shadow: 0 0 5px #60d6b5;
    border: none;
    outline: none;
  }
  @media (max-width: 769px) {
    height: 18px;
    margin-top: 5px;
    width: 30px;
    font-size: 0.5rem;
  }
`;

const Input = styled.input<{ genE: boolean }>`
  background-color: ${(props) => (props.genE ? "#383838" : "#282828")};
  color: white;
  text-align: center;
  text-overflow: ellipsis;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  height: 30px;
  width: 200px;
  font-weight: 600;
  font-size: 1.5rem;
  border: none;
  border-radius: 3px;
  transition: 0.5s all;
  ::placeholder {
    color: white;
  }
  :focus {
    box-shadow: 0 0 5px #60d6b5;
    border: none;
    outline: none;
  }
  @media (max-width: 1025px) {
    font-size: 1rem;
    width: 150px;
  }
  @media (max-width: 769px) {
    height: 20px;
    width: 100px;
  }
`;

const TextArea = styled.textarea<{ genE: boolean }>`
  background-color: ${(props) => (props.genE ? "#383838" : "#282828")};
  color: white;
  width: inherit;
  margin-right: 15%;
  font-family: "Poppins", sans-serif;
  resize: none;
  border: 0px;
  border-radius: 3px;
  transition: 0.5s all;
  font-size: 1rem;
  font-weight: 200;
  height: 70%;
  
  overflow: auto;
  :focus {
    box-shadow: 0 0 5px #60d6b5;
    border: none;
    outline: none;
  }

  @media (max-width: 1025px) {
    height: 60%;
  }
  @media (max-width: 769px) {
    height: 10vh;
    margin: 2.5% 10%;
    font-size: 0.7rem;

    ::placeholder {
      text-align: center;
    }
  }
`;

const Edit = styled.img<{ genE: boolean }>`
  filter: ${(props) =>
    props.genE ? "drop-shadow(2px 2px 10px red) invert()" : "invert()"};
  width: 20px;
  height: 20px;
  margin-left: 80%;

  :hover {
    filter: drop-shadow(2px 2px 10px red) invert();
    cursor: pointer;
  }
  @media (max-width: 769px) {
    margin-top: 5%;
    margin-right: 5%;
  }
`;

const Pfp = styled.img<{ genE: boolean }>`
  filter: ${(props) =>
    props.genE ? "drop-shadow(1px 1px 8px #66c2a9) brightness(100%)" : ""};
  aspect-ratio: 1/1;
  height: 9rem;
  width: 9rem;
  border: 5px solid #66c2a9;
  border-radius: 50%;
  background-color: #266152;
  transition: 0.5s all;

  @media (max-width: 1025px) {
    height: 7.5rem;
    width: 7.5rem;
  }
`;

const Label = styled.p`
  font-size: min(20px, 1.2vw);
  font-weight: 600;
  margin: 0;

  @media (max-width: 1025px) {
    font-size: 0.75rem;
  }
`;

const RankLabel = styled.div`
  padding-left: 0px;
  text-align: center;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  @media (max-width: 1025px) {
    font-size: 0.75rem;
  }
`;

const Ranks = styled.div`
  margin-top: 5%;
  margin-left: 0;

  @media (max-width: 769px) {
    margin-left: 11%;
    margin-right: 11%;
  }

  @media (max-width: 769px) {
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

const ServerPref = styled.span`
  margin: 0 2%;
  font-size: 0.75rem;
  @media (max-width: 769px) {
    margin-top: 5px;
    font-size: 0.5rem;
  }
`;