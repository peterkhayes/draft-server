// @flow
import type {
  Player,
  PlayerList,
  CardList,
  PlayerState,
  GameState,
  GameStateStarted,
} from '../types';

const shuffle = require('lodash/fp/shuffle');
const allCards: CardList = require('./cards');

let gameState: GameState = {
  state: 'not-started',
  players: [],
};

exports.addPlayer = (player: Player) => {
  const alreadyInGame = gameState.players.includes(player);
  if (gameState.state === 'not-started') {
    if (!alreadyInGame) {
      gameState.players.push(player);
    }
  } else {
    if (!alreadyInGame) {
      throw new Error("Cannot add new players to a game that has already started");
    }
  }
}

exports.startGame = () => {
  if (gameState.state !== 'not-started') {
    throw new Error("Game has already started");
  }

  if (gameState.players.length === 0) {
    throw new Error("Must have at least one player in the game");
  }

  const players = gameState.players;

  gameState = {
    state: 'started',
    players: players,
    remainingCards: allCards,
    cardsByPlayer: buildMap(players, () => []),
    choicesByPlayer: buildMap(players, () => []),
  }
};

exports.playerGetState = (player: Player): PlayerState => {
  if (gameState.state === 'not-started') {
    return {
      state: 'not-started',
      players: gameState.players,
    }
  }

  const { players, remainingCards, cardsByPlayer, choicesByPlayer } = gameState;
  const playerCards = cardsByPlayer[player];
  const playerChoices = choicesByPlayer[player];

  if (playerChoices.length === players.length) {
    return {
      state: 'ready',
      players,
      remainingCards,
      playerCards,
      playerChoices,
    }
  } else {
    return {
      state: 'waiting',
      players,
      remainingCards,
      playerCards,
      playerChoices,
    }
  }
}

exports.playerSetChoices = (player: Player, choices: CardList) => {
  if (gameState.state !== 'started') {
    throw new Error("The game has not started yet");
  }

  const { players, remainingCards, choicesByPlayer, cardsByPlayer } = gameState;
  for (const choice of choices) {
    if (!remainingCards.includes(choice)) {
      if (!allCards.includes(choice)) {
        throw new Error(`Card ${choice} is not a valid card`)
      } else {
        throw new Error(`Card ${choice} has already been chosen`);
      }
    }
  }

  choicesByPlayer[player] = choices;

  if (allPlayersHaveChosen(gameState)) {
    const shuffledPlayers: PlayerList = shuffle(players);
    let newRemainingCards = remainingCards;

    for (const player of shuffledPlayers) {
      const card = choicesByPlayer[player].shift();
      cardsByPlayer[player].push(card);
      for (const p of players) {
        choicesByPlayer[p] = choicesByPlayer[p].filter((c) => c !== card);
      }
      newRemainingCards = newRemainingCards.filter((c) => c !== card);
    }

    gameState.remainingCards = newRemainingCards;
  }
}

function allPlayersHaveChosen(gameState: GameStateStarted): boolean {
  const { choicesByPlayer, players } = gameState;
  return Object.keys(choicesByPlayer).every((player) =>
    choicesByPlayer[player].length === players.length
  );
}

function buildMap<Key: string, Val>(keys: Array<Key>, val: (key: Key) => Val): {[key: Key]: Val} {
  const result = {};
  for (const key of keys) {
    result[key] = val(key);
  }
  return result;
}