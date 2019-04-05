import React from 'react';
import './Status.css';

export default function Status(props) {
  return (
    <div className="status">
      <div className="lcd minesLeft">{props.minesLeft}</div>
      <button className="restart" onClick={props.onClick}>
        {props.buttonStatus}
      </button>
      <div className="lcd timer">{props.time}</div>
    </div>
  );
};
