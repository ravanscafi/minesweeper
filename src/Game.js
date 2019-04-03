import React, {Component} from 'react';
import './Game.css';
import Board from './Board';
import Status from './Status';

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
      bestTime: localStorage.getItem('bestTime'),
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

  updateGameStatus(game, row, column) {
    if (Game.isMine(game, row, column)) {
      this.stopTimer();

      game = game.map(
        (row, rowKey) => row.map(
          (square, squareKey) => {
            const isMine = Game.isMine(this.state.solution, rowKey, squareKey);
            if (square === '🚩') {
              return isMine ? square : '❌';
            }

            return isMine ? '*' : square;
          }
        )
      );

      return this.setState({
        game: game,
        gameFinished: true,
        buttonStatus: '💀',
      });
    }

    const gameFinished = !this.thereAreRemainingMoves(game);
    const buttonStatus = gameFinished ? '😎' : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;
    let bestTime = this.state.bestTime;

    if (gameFinished) {
      this.stopTimer();
      game = this.getSolution(game, '🚩');
      minesLeft = 0;
      bestTime = bestTime === null || (this.state.time < bestTime) ? this.state.time : bestTime;
    }

    if (bestTime !== this.state.bestTime) {
      localStorage.setItem('bestTime', bestTime);
    }

    this.setState({...game, gameFinished, buttonStatus, minesLeft, bestTime});
  }

  getSolution(squares, symbol) {
    return squares.map(
      (row, rowKey) => row.map(
        (square, squareKey) =>
          Game.isMine(this.state.solution, rowKey, squareKey) ? symbol : this.state.solution[rowKey][squareKey]
      )
    );
  }

  thereAreRemainingMoves(squares) {
    return squares.flat().filter(
      sq => (sq === null || sq === '🚩')
    ).length > this.maximumMines;
  }

  static randomInRange(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
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
      row = Game.randomInRange(0, this.height - 1);
      column = Game.randomInRange(0, this.width - 1);

      if (!Game.isMine(squares, row, column)) {
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
    if (this.inRange(row, column) && !Game.isMine(squares, row, column)) {
      squares[row][column] = squares[row][column] + 1;
    }
  }

  static isMine(squares, row, column) {
    return squares[row][column] === '*';
  }

  inRange(row, column) {
    return row >= 0 && row < this.height
      && column >= 0 && column < this.width;
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

  render() {
    return (
      <div className="Game">
        <div className="wrapper">
          <Status
            buttonStatus={this.state.buttonStatus}
            minesLeft={this.state.minesLeft}
            time={this.state.time}
            onClick={() => this.setState(this.getInitialState())}
          />
        </div>
        <Board
          onClick={(row, column) => this.handleClick(row, column)}
          onRightClick={(event, row, column) => this.handleRightClick(event, row, column)}
          game={this.state.game}
        />
        <div className="bestScore">
          {this.state.bestTime !== null ? 'Best time: '+this.state.bestTime : ''}
        </div>
      </div>
    );
  }
}

export default Game;
