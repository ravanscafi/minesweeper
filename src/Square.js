import React from 'react';
import './Square.css';

const getClass = value =>
  value === '*' ? 'mine' : (value !== null ? 'revealed number'+value : 'unrevealed');

export default function Square(props) {
  return (
    <button
      className={`Square ${getClass(props.value)}`}
      onClick={props.onClick}
      onContextMenu={props.onRightClick}
    >
      {props.value ? props.value : ''}
    </button>
  );
};
