import React from 'react';
import './Square.css';

export default function Square(props) {
  return (
    <button
      className={'Square '+(props.value === '*' ? 'mine' : (props.value !== null ? 'revealed number'+props.value : 'unrevealed'))}
      onClick={props.onClick}
      onContextMenu={props.onRightClick}
    >
      {props.value ? props.value : ''}
    </button>
  );
};
