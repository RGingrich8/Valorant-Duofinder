import React, { useState, useEffect, useCallback, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import styled from "styled-components/macro";
import HistoryCard from "./HistoryCard";
import { IHistoryEntry, WidthContext } from "./ChatHistory";

import ProfileCardUpdated from "./ProfileCardUpdated";

type Props = {
  history: Array<IHistoryEntry>;
  slides: Array<number>;
  ClickHandler: () => void;
  mainChanged : (main : number) => void;
};

export const EmblaCarousel = (props: Props) => {
  let [viewportRef, embla] = useEmblaCarousel({
    align: "center",
    skipSnaps: false,
    draggable: false,
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [main, setMain] = useState(0);
  const width = useContext(WidthContext);

  const scrollPrev = useCallback(() => {
    embla && embla.scrollPrev();
    setMain(main - 1);
    props.ClickHandler();
  }, [embla, main]);

  const scrollNext = useCallback(() => {
    embla && embla.scrollNext();
    setMain(main + 1);
    props.ClickHandler();
  }, [embla, main]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  useEffect(() => {
    props.mainChanged(main);
  }, [main]);

  return (
    <Container>
      <EmblaViewPort ref={viewportRef}>
        <EmblaContainer>
          {props.history.map((entry: IHistoryEntry) => 
            width > 1000 ? (
              <WrapperOuter>
                <WrapperInner>
                  <HistoryCard
                    key={entry.user._id+entry.key}
                    url={entry.user.avatarImage}
                    username={entry.user.displayName}
                    isMain={main === entry.key}
                    zIndex={main === entry.key ? "3" : "1"}
                  />
                </WrapperInner>
              </WrapperOuter>
            ) : (
              <WrapperOuter>
                <WrapperInner>
                  <ProfileCardWrapper>
                    <ProfileCardUpdated
                      isMain={main === entry.key}
                      imgSrc={entry.user.avatarImage}
                      userName={entry.user.displayName}
                      chatRank="images/reputation_ranks/ToxicWaste.png"
                      userType="gamer"
                      valRank="images/ranks/rank_7_3.webp"
                      aboutMe="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
                    ></ProfileCardUpdated>
                  </ProfileCardWrapper>
                </WrapperInner>
              </WrapperOuter>
            )
          )}
        </EmblaContainer>
      </EmblaViewPort>

      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
    </Container>
  );
};

interface IButtonProps {
  enabled: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const PrevButton = (props: IButtonProps) => (
  <button
    className="embla__button embla__button--prev"
    onClick={props.onClick}
    disabled={!props.enabled}
  >
    <svg className="embla__button__svg" viewBox="137.718 -1.001 366.563 644">
      <path d="M428.36 12.5c16.67-16.67 43.76-16.67 60.42 0 16.67 16.67 16.67 43.76 0 60.42L241.7 320c148.25 148.24 230.61 230.6 247.08 247.08 16.67 16.66 16.67 43.75 0 60.42-16.67 16.66-43.76 16.67-60.42 0-27.72-27.71-249.45-249.37-277.16-277.08a42.308 42.308 0 0 1-12.48-30.34c0-11.1 4.1-22.05 12.48-30.42C206.63 234.23 400.64 40.21 428.36 12.5z" />
    </svg>
  </button>
);

export const NextButton = (props: IButtonProps) => (
  <button
    className="embla__button embla__button--next"
    onClick={props.onClick}
    disabled={!props.enabled}
  >
    <svg className="embla__button__svg" viewBox="0 0 238.003 238.003">
      <path d="M181.776 107.719L78.705 4.648c-6.198-6.198-16.273-6.198-22.47 0s-6.198 16.273 0 22.47l91.883 91.883-91.883 91.883c-6.198 6.198-6.198 16.273 0 22.47s16.273 6.198 22.47 0l103.071-103.039a15.741 15.741 0 0 0 4.64-11.283c0-4.13-1.526-8.199-4.64-11.313z" />
    </svg>
  </button>
);

const Container = styled.div`
  position: relative;
  padding: 2%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media all and (max-width: 500px) {
    height: 90%;
    padding: 0;
  }
`;

const EmblaViewPort = styled.div`
  position: relative;

  overflow: hidden;
  width: 95%;

  box-shadow: inset -100px 4px 40px rgba(24, 24, 24, 0.4);
`;

// For all the cards
const EmblaContainer = styled.div`
  position: relative;
  display: flex;
  user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* This needs to be the same as the margin in History Card */
  margin-left: -1px;
`;

const ProfileCardWrapper = styled.div`
  position: relative;
  padding: 1%;
  width: 90%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// It's parent has no actual width
const WrapperOuter = styled.div`
  /* This needs to be the same as the margin in .embla_container*/
  position: relative;
  padding-left: 1px;

  @media all and (max-width: 500px) {
    min-height: 20vh;
    min-width: 95vw;
  }
`;

const WrapperInner = styled.div`
  position: relative;
  overflow: hidden;

  height: 190px;
  width: 400px;

  display: flex;
  justify-content: center;
  align-items: center;

  @media all and (max-width: 500px) {
    height: 100%;
    width: 100%;
    /* background-color: aliceblue; */
  }
`;

// const EmblaSlide = styled.div<{ width: string }>`
//     position: relative;
//     flex: 0 0 ${(props) => props.width};
// `;

export default EmblaCarousel;
