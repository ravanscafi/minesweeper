import React, {Component} from 'react';
import './Game.css';
import Board from './Board';

class Game extends Component {
  height = 9;
  width = 9;
  maximumMines = 10;

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    this.stopTimer();

    return {
      solution: this.generateGame(),
      game: this.generateArray(null),
      gameFinished: false,
      buttonStatus: '🙂',
      minesLeft: this.maximumMines,
      gameStarted: false,
      time: 0,
      start: 0,
    };
  }

  checkStart() {
    if (!this.state.gameStarted) {
      this.startTimer();
      this.setState({gameStarted: true});
    }
  }

  handleClick(row, column) {
    const game = this.state.game.slice();
    this.checkStart();

    if (this.state.gameFinished || game[row][column] !== null) {
      return;
    }

    this.reveal(game, row, column);

    this.updateGameStatus(game, row, column);
  }

  handleRightClick(event, row, column) {
    const game = this.state.game.slice();
    event.preventDefault();
    this.checkStart();

    let value = game[row][column];
    if (this.state.gameFinished
      || (value !== null && value !== '🚩')) {
      return;
    }

    game[row][column] = value ? null : '🚩';
    const minesLeft = this.state.minesLeft + (game[row][column] ? -1 : 1);

    this.setState({...game, minesLeft});
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
      this.stopTimer();

      squares = squares.map(
        (row, rowKey) => row.map(
          (square, squareKey) => {
            const isMine = this.isMine(this.state.solution, rowKey, squareKey);
            if (square === '🚩') {
              return isMine ? square : '❌';
            }

            return isMine ? '*' : square;
          }
        )
      );

      return this.setState({
        game: squares,
        gameFinished: true,
        buttonStatus: '💀',
      });
    }

    const gameFinished = !this.thereAreRemainingMoves(squares);
    const buttonStatus = gameFinished ? '😎' : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;

    if (gameFinished) {
      this.stopTimer();
      squares = this.getSolution(squares, '🚩');
      minesLeft = 0;
    }

    this.setState({
      game: squares,
      gameFinished: gameFinished,
      buttonStatus: buttonStatus,
      minesLeft: minesLeft,
    });
  }

  getSolution(squares, symbol) {
    return squares.map(
      (row, rowKey) => row.map(
        (square, squareKey) =>
          this.isMine(this.state.solution, rowKey, squareKey) ? symbol : this.state.solution[rowKey][squareKey]
      )
    );
  }

  thereAreRemainingMoves(squares) {
    return squares.flat().filter(
      sq => (sq === null || sq === '🚩')
    ).length > this.maximumMines;
  }

  randomInRange(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
  }

  generateArray(value) {
    return Array.from(
      {length: this.height},
      () => Array.from({length: this.width}, () => value)
    )
  }

  generateGame() {
    const squares = this.generateArray(0);
    let generatedMines = 0;
    let row;
    let column;

    while (generatedMines < this.maximumMines) {
      row = this.randomInRange(0, this.height - 1);
      column = this.randomInRange(0, this.width - 1);

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
      && row < this.height
      && column < this.width;
  }

  startTimer() {
    this.setState({
      time: this.state.time,
      start: Date.now() - this.state.time,
    });
    if (this.timer) {
      this.stopTimer();
    }
    this.timer = setInterval(() => this.setState({
      time: Math.floor((Date.now() - this.state.start) / 1000),
    }), 1);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  leftPad(number) {
    return number.toString().padStart(3, '0');
  }

  render() {
    return (
      <div className="Game">
        <div className="wrapper">
          <div className="status">
            <div className="lcd minesLeft">{this.leftPad(this.state.minesLeft)}</div>
            <button className="restart" onClick={() => this.setState(this.getInitialState())}>
              {this.state.buttonStatus}
            </button>
            <div className="lcd timer">{this.leftPad(this.state.time)}</div>
          </div>
        </div>
        <Board
          onClick={(row, column) => this.handleClick(row, column)}
          onRightClick={(event, row, column) => this.handleRightClick(event, row, column)}
          game={this.state.game}
        />
      </div>
    );
  }
}

export default Game;
