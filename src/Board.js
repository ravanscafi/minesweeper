import React from 'react';
import Square from './Square';
import './Board.css';

const renderSquare = (props, row, column, value) => {
  return (
    <Square
      key={row + "_" + column}
      value={value}
      onClick={() => props.onClick(row, column)}
      onRightClick={(event) => props.onRightClick(event, row, column)}
    />
  );
};

const renderRow = (props, row, items) =>
  items.map((value, key) => renderSquare(props, row, key, value));

export default function Board(props) {
  return (
    <div
      className={'Board' + (props.gameFinished ? ' disabled' : '')}
      style={{gridTemplateColumns: `repeat(${props.width}, 1fr)`}}
    >
      {props.game.map((value, key) => renderRow(props, key, value))}
    </div>
  );
};
