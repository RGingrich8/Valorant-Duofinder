import React from "react";
import styled from "styled-components";

type Props = {
    size: string;
    url: string;
    showBorder: boolean;
};

export default function ProfilePicture(props: Props): React.ReactElement {
    return (
        <Wrapper size={props.size}>
            <Image url={props.url} />
        </Wrapper>
    );
}

const Wrapper = styled.div<{ size: string }>`
    position: relative;
    aspect-ratio: 1;
    height: ${(props) => props.size || "100%"};
`;

const Image = styled("img")<{ url: string }>`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: white;

    content: url(${(props) => props.url});
`;
