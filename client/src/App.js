// @flow
import type { Card, Player, CardList, PlayerState } from '../../types';
import React from 'react';
import PlayerInput from './PlayerInput';
import WaitingForGame from './WaitingForGame';
import PlayerCards from './PlayerCards';
import CardPicker from './CardPicker';
import fetch, { type ReqWithoutPlayer, type ReqWithPlayer } from './fetch';


type State = {
  player: ?Player,
  playerState: PlayerState,
  requestQueue: Array<ReqWithoutPlayer>,
}

class App extends React.Component<{}, State> {
  constructor() {
    super();
    this.state = {
      player: null,
      playerState: { state: 'not-started', players: [] },
      requestQueue: [],
    }
    setInterval(this._pollPlayerState, 500);
  }

  _enqueueRequest = (req: ReqWithoutPlayer) => {
    this.setState({
      requestQueue: this.state.requestQueue.concat(req),
    });
  };

  _dequeueRequest = () => {
    const { player, requestQueue } = this.state;
    if (player && requestQueue.length > 0) {
      const req = requestQueue.shift();
      const reqWithPlayer: ReqWithPlayer = { ...req, player };
      this.setState({requestQueue});
      fetch(reqWithPlayer).then((playerState) => {
        this.setState({playerState});
      });
    }
  };

  _setPlayer = (player: Player) => {
    this.setState({ player });
    this._enqueueRequest({
      url: '/player',
      method: 'POST',
      body: { player },
    })
  }

  _startGame = () => {
    this._enqueueRequest({
      url: '/start',
      method: 'POST',
      body: {},
    });
  };

  _pollPlayerState = () => {
    const { player, requestQueue } = this.state;
    if (player && requestQueue.length === 0) {
      this._enqueueRequest({
        url: '/state',
        method: 'GET',
      });
    }
    this._dequeueRequest();
  };

  _saveChoices = (choices: CardList) => {
    this._enqueueRequest({
      url: '/choose',
      method: 'POST',
      body: {choices},
    });
  }

  render() {
    const { player, playerState } = this.state;

    if (player == null) {
      return (
        <PlayerInput setPlayerFn={this._setPlayer} />
      )
    }

    if (playerState.state === 'not-started') {
      return (
        <WaitingForGame players={playerState.players} startGameFn={this._startGame} />
      )
    }

    if (playerState.state === 'ready') {
      return (
        <div>
          <h3>Waiting for other players</h3>
          <PlayerCards cards={playerState.playerCards} />
        </div>
      );
    }

    if (playerState.state === 'waiting') {
      return (
        <div>
          <CardPicker
            numPlayers={playerState.players.length}
            availableCards={playerState.remainingCards}
            choices={playerState.playerChoices}
            saveChoicesFn={this._saveChoices}
          />
          <PlayerCards cards={playerState.playerCards} />
        </div>
      )
    }
  }
}

export default App;
