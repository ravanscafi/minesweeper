import React from 'react';
import './DifficultyLevel.css';

export default function DifficultyLevel(props) {
  return (
    <button
      className={'difficulty-level ' + (props.isSelected ? 'selected' : '')}
      onClick={props.onClick}
    >
      {props.label}{' '}
      <span role="img" aria-label={props.label}>{props.emoji}</span>
    </button>
  );
};
