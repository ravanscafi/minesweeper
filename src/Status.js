import React from 'react';
import './Status.css';

const leftPad = number => number.toString().padStart(3, '0');

export default function Status(props) {
  return (
    <div className="status">
      <div className="lcd minesLeft">{leftPad(props.minesLeft)}</div>
      <button className="restart" onClick={props.onClick}>
        {props.buttonStatus}
      </button>
      <div className="lcd timer">{leftPad(props.time)}</div>
    </div>
  );
};
