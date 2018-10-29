// @flow
import type { PlayerList } from '../../types';

import React from 'react';

type Props = {
  players: PlayerList,
  startGameFn: () => void,
};

export default function WaitingForGame({players, startGameFn}: Props) {
  return (
    <div>
      <h3>Waiting for the game to begin</h3>
      <div>Current players: {players.join(", ")}</div>
      <div><button onClick={startGameFn}>Start Game</button></div>
    </div>
  )
}