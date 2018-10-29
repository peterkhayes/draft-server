// @flow
import type { CardList } from '../../types';

import React from 'react';

type Props = {
  cards: CardList,
};

export default function PlayerCards({cards}: Props) {
  return (
    <div>
      {cards.length > 0 && <h3>You've picked these cards</h3>}
      <ul>
        {cards.map((card) => <li key={card}>{card}</li>)}
      </ul>
    </div>
  )
}