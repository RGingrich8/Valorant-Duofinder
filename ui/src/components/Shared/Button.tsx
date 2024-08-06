import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type Props = {
  text: string;
  width?: string;
  height?: string;
  img_url?: string;
  fontSize?: string;
  url?: string;
  svg?: boolean;
};

function Button(props: Props): React.ReactElement {
  let navigate = useNavigate();
  const onClickHandler = () => {
    navigate(`${props.url}`);
  };

  return (
    <Wrapper onClick={onClickHandler} height={props.height} width={props.width}>
      {props.img_url ? <Image url={props.img_url} size={"40px"} /> : 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        {/* <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --> */}
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
      </svg>
      }
      <Text fontSize={props.fontSize}>{props.text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div<{ width?: string; height?: string }>`
  display: flex;
  justify-content: space-evenly;

  align-items: center;
  padding: 1%;

  background: #66c2a9;
  background-blend-mode: darken;
  mix-blend-mode: normal;
  box-shadow: 0px 3px 3px -2px rgba(255, 255, 255, 0.35);
  border-radius: 10px;

  aspect-ratio: 16/7;
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  transition: 0.5s all;

  :hover {
    box-shadow: 0 0 7.5px #66c2a9;

    cursor: pointer;
    // For no text selection
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }

  svg{
    fill: white;
    height: 2vw;
    width: 2vw;
  }


`;

const Image = styled.img<{ url: string; size: string }>`
  position: relative;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  content: url(${(props) => props.url});
`;

const Text = styled.div<{ fontSize: string }>`
  font-family: "Arimo";
  font-style: normal;
  font-weight: 700;
  font-size: ${(props) => (props.fontSize ? props.fontSize : "1.5em")};

  text-align: center;

  color: #ffffff;

  mix-blend-mode: normal;

  @media all and (max-width: 1400px) {
    font-size: 1rem;
  }

  @media all and (max-width: 500px) {
    font-size: 1rem;
  }
`;

export default Button;
