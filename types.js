// @flow

export type Player = string;

export type PlayerList = Array<Player>;

export type Card = string;

export type CardList = Array<Card>;

export type CardsByPlayer = {[player: Player]: CardList};

export type ReadyStateByPlayer = {[player: Player]: true};

export type PlayerStateNotStarted = {
  state: 'not-started',
  players: PlayerList,
};

export type PlayerStateReady = {
  state: 'ready',
  players: PlayerList,
  remainingCards: CardList,
  playerCards: CardList,
  playerChoices: CardList,
}

export type PlayerStateWaiting = {
  state: 'waiting',
  players: PlayerList,
  remainingCards: CardList,
  playerCards: CardList,
  playerChoices: CardList,
}

export type PlayerState =
  | PlayerStateNotStarted
  | PlayerStateReady
  | PlayerStateWaiting;

export type GameStateNotStarted = {
  state: 'not-started',
  players: Array<Player>,
};

export type GameStateStarted = {
  state: 'started',
  players: Array<Player>,
  remainingCards: CardList,
  cardsByPlayer: CardsByPlayer,
  choicesByPlayer: CardsByPlayer,
};

export type GameState =
  | GameStateNotStarted
  | GameStateStarted;