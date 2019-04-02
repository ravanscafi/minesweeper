import React, {Component} from 'react';
import './Game.css';
import Board from './Board';

//const height = 16;
//const width = 16;
//const mines = 51;

const height = 9;
const width = 9;
const mines = 10;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      solution: this.generateGame(),
      game: this.generateArray(null),
      gameFinished: false,
      buttonStatus: '🙂',
    };
  }

  handleClick(row, column) {
    // TODO don't start losing :(
    const game = this.state.game.slice();

    if (this.state.gameFinished || game[row][column] !== null) {
      return;
    }

    this.reveal(game, row, column);

    this.updateGameStatus(game, row, column);
  }

  reveal(squares, row, column) {
    if (!this.inRange(row, column) || squares[row][column] !== null) {
      return;
    }

    squares[row][column] = this.state.solution[row][column];

    if (squares[row][column] === 0) {
      this.expand(squares, row, column);
    }
  }

  expand(squares, row, column) {
    this.reveal(squares, row - 1, column);
    this.reveal(squares, row + 1, column);
    this.reveal(squares, row, column - 1);
    this.reveal(squares, row, column + 1);
    this.reveal(squares, row - 1, column - 1);
    this.reveal(squares, row - 1, column + 1);
    this.reveal(squares, row + 1, column + 1);
    this.reveal(squares, row + 1, column - 1);
  }

  updateGameStatus(squares, row, column) {
    if (this.isMine(squares, row, column)) {
      return this.setState({
        game: squares,
        gameFinished: true,
        buttonStatus: '💀',
      });
    }

    const gameFinished = !this.thereAreRemainingMoves(squares);
    const buttonStatus = gameFinished ? '😎' : this.state.buttonStatus;

    if (gameFinished) {
      squares = squares.map(row => row.map(square => square !== null ? square : '🚩'));
    }

    this.setState({
      game: squares,
      gameFinished: gameFinished,
      buttonStatus: buttonStatus,
    });
  }

  thereAreRemainingMoves(squares) {
    return squares.flat().filter(sq => sq === null).length > mines;
  }

  randomInRange(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
  }

  generateArray(value) {
    return Array.from({length: height}, () => Array.from({length: width}, () => value))
  }

  generateGame() {
    const squares = this.generateArray(0);
    let generatedMines = 0;
    let row;
    let column;

    while (generatedMines < mines) {
      row = this.randomInRange(0, height - 1);
      column = this.randomInRange(0, width - 1);

      if (!this.isMine(squares, row, column)) {
        squares[row][column] = '*';
        this.incrementSquare(squares, row - 1, column);
        this.incrementSquare(squares, row + 1, column);
        this.incrementSquare(squares, row, column - 1);
        this.incrementSquare(squares, row, column + 1);
        this.incrementSquare(squares, row - 1, column - 1);
        this.incrementSquare(squares, row - 1, column + 1);
        this.incrementSquare(squares, row + 1, column + 1);
        this.incrementSquare(squares, row + 1, column - 1);
        generatedMines++;
      }
    }

    return squares;
  }

  incrementSquare(squares, row, column) {
    if (this.inRange(row, column) && !this.isMine(squares, row, column)) {
      squares[row][column] = squares[row][column] + 1;
    }
  }

  isMine(squares, row, column) {
    return squares[row][column] === '*';
  }

  inRange(row, column) {
    return row >= 0
      && column >= 0
      && row < height
      && column < width;
  }

  render() {
    return (
      <div className="Game">
        <div className="status">
          <button className="restart" onClick={() => this.setState(this.getInitialState())}>
            {this.state.buttonStatus}
          </button>
        </div>
        <Board
          onClick={(row, column) => this.handleClick(row, column)}
          game={this.state.game}
        />
      </div>
    );
  }
}

export default Game;
