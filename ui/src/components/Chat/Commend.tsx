import * as React from "react";

type Props = {
  myID: string;
  playerID: string;
  rating: number;
};

export function Commend(props: Props) {
  let rateUser = {
    userID: props.myID,
    teammateID: props.playerID,
    rating: props.rating,
  };
}
