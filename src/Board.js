import React, {Component} from 'react';
import Square from './Square';
import './Board.css';

class Board extends Component {
  renderSquare(row, column, value) {
    return (
      <Square
        key={row + "_" + column}
        value={value}
        onClick={() => this.props.onClick(row, column)}
      />
    );
  }

  renderRow(row, items) {
    return (
      <div className="row" key={row}>
        {items.map((value, key) => this.renderSquare(row, key, value))}
      </div>
    );
  }

  render() {
    return (
      <div className="Board">
        {this.props.game.map((value, key) => this.renderRow(key, value))}
      </div>
    );
  }
}

export default Board;
