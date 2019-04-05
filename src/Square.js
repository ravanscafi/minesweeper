import React from 'react';
import './Square.css';

const classMapping = {
  'C': 'emoji mine clicked',
  'M': 'emoji mine',
  'F': 'emoji flag',
  'W': 'emoji wrong',
  null: 'unrevealed',
};

const symbolMapping = {
  'C': '💣',
  'M': '💣',
  'F': '🚩',
  'W': '❌',
};

const getClass = value => classMapping[value] || 'revealed number' + value;
const getSymbol = value => symbolMapping[value] || (value ? value : null);

export default function Square(props) {
  return (
    <button
      className={`Square ${getClass(props.value)}`}
      onClick={props.onClick}
      onContextMenu={props.onRightClick}
    >
      {getSymbol(props.value)}
    </button>
  );
};
