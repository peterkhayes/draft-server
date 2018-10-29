// @flow
import type { Player } from '../../types';

import React from 'react';

type Props = {
  setPlayerFn: (player: Player) => void,
};

type State = {
  player: string,
}

export default class PlayerInput extends React.Component<Props, State> {
  state = { player: localStorage.getItem('player') || '' };

  _onPlayerChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const player = e.currentTarget.value;
    this.setState({player });
    localStorage.setItem('player', player);
  }

  _setPlayer = () => {
    const { player } = this.state;
    if (player) {
      this.props.setPlayerFn(player);
    }
  }

  render() {
    return (
      <div>
        <h3>Enter your name</h3>
        <div><input type="text" value={this.state.player} onChange={this._onPlayerChange} /></div>
        <div><button onClick={this._setPlayer}>Join Game</button></div>
      </div>
    )
  }
}