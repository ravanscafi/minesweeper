import React from 'react';
import './Square.css';

export default function Square(props) {
  return (
    <button
      className={"Square"+(props.value === '*' ? ' mine' : (props.value !== null ? ' revealed number'+props.value : ''))}
      onClick={props.onClick}
    >
      {props.value ? props.value : ''}
    </button>
  );
};
