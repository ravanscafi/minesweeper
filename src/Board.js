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

const renderRow = (props, row, items) => {
  return (
    <div className="row" key={row}>
      {items.map((value, key) => renderSquare(props, row, key, value))}
    </div>
  );
};

export default function Board(props) {
  return (
    <div className="Board">
      {props.game.map((value, key) => renderRow(props, key, value))}
    </div>
  );
};
