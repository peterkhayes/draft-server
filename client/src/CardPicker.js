// @flow
import type { CardList } from '../../types';

import React from 'react';
import isEqual from 'lodash/fp/isEqual';

type Props = {
  numPlayers: number,
  availableCards: CardList,
  choices: CardList,
  saveChoicesFn: (choices: CardList) => void,
};

type State = {
  choices: CardList,
}

export default class PlayerCards extends React.Component<Props, State> {
  state = {choices: this.props.choices};

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      choices: this.state.choices.filter((card) =>
        nextProps.availableCards.includes(card)
      )
    })
  }

  _saveChoices = () => {
    this.props.saveChoicesFn(this.state.choices);
  }

  _renderSelect(idx: number) {
    const { availableCards } = this.props;
    const { choices } = this.state;

    const currentChoice = choices[idx];

    const cardOptions = availableCards
      .filter((card) => !choices.includes(card))
      .concat(currentChoice)
      .filter(Boolean);

    const onChange = (e) => {
      const selectedIndex = e.currentTarget.options.selectedIndex - 1;
      const newChoices = choices.slice();
      newChoices[idx] = cardOptions[selectedIndex];
      this.setState({choices: newChoices});
    }

    return (
      <div key={idx}>
        <h5>Card {idx + 1}</h5>
        <select value={currentChoice} onChange={onChange}>
          <option key="null" value="">-</option>
          {cardOptions.map((card) => (
            <option key={card} value={card}>{card}</option>
          ))}
        </select>
      </div>
    )
  }

  render() {
    const { numPlayers } = this.props;
    const { choices } = this.state;

    const valid = choices.filter(Boolean).length === numPlayers;

    console.log(choices);

    return (
      <div>
        <h3>Pick your desired cards</h3>
        {new Array(numPlayers).fill(null).map((_, idx) => this._renderSelect(idx))}
        <button disabled={!valid} onClick={this._saveChoices}>Ready</button>
      </div>
    )
  }
}