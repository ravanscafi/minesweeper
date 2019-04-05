import React, {Component} from 'react';
import './Game.css';
import Board from './Board';
import Status from './Status';

class Game extends Component {
  height = 9;
  width = 9;
  maximumMines = 10;

  static randomInRange(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  static isMine(squares, row, column) {
    return squares[row][column] === '*';
  }

  static generateArray(height, width, value) {
    return Array.from(
      {length: height},
      () => Array.from({length: width}, () => value)
    )
  }

  static getSolution(game, solution, symbol) {
    return game.map(
      (row, rowKey) => row.map(
        (square, squareKey) =>
          Game.isMine(solution, rowKey, squareKey) ? symbol : solution[rowKey][squareKey]
      )
    );
  }

  static thereAreRemainingMoves(squares, maximumMines) {
    return squares.flat().filter(
      sq => (sq === null || sq === '🚩')
    ).length > maximumMines;
  }


  static leftPad(number) {
    return number.toString().padStart(3, '0');
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    this.stopTimer();

    return {
      solution: this.generateGame(this.height, this.width, this.maximumMines),
      game: Game.generateArray(this.height, this.width, null),
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
    }
  }

  handleClick(row, column) {
    let game = this.state.game.slice();
    this.checkStart();

    if (this.state.gameFinished || game[row][column] !== null) {
      return;
    }

    this.reveal(game, row, column);

    this.updateGameStatus(game, row, column);
  }

  handleRightClick(event, row, column) {
    let game = this.state.game.slice();
    event.preventDefault();
    this.checkStart();

    let value = game[row][column];
    if (this.state.gameFinished
      || (value !== null && value !== '🚩')) {
      return;
    }

    game[row][column] = value ? null : '🚩';
    const minesLeft = this.state.minesLeft + (game[row][column] ? -1 : 1);

    this.setState({game, minesLeft});
  }

  reveal(game, row, column) {
    if (!this.inRange(row, column) || game[row][column] !== null) {
      return;
    }

    game[row][column] = this.state.solution[row][column];

    if (game[row][column] === 0) {
      this.expand(game, row, column);
    }
  }

  expand(game, row, column) {
    this.reveal(game, row - 1, column);
    this.reveal(game, row + 1, column);
    this.reveal(game, row, column - 1);
    this.reveal(game, row, column + 1);
    this.reveal(game, row - 1, column - 1);
    this.reveal(game, row - 1, column + 1);
    this.reveal(game, row + 1, column + 1);
    this.reveal(game, row + 1, column - 1);
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
        game,
        gameFinished: true,
        buttonStatus: '💀',
      });
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.maximumMines);
    const buttonStatus = gameFinished ? '😎' : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;
    let bestTime = this.state.bestTime;

    if (gameFinished) {
      this.stopTimer();
      game = Game.getSolution(game, this.state.solution, '🚩');
      minesLeft = 0;
      bestTime = bestTime === null || (this.state.time < bestTime) ? this.state.time : bestTime;
    }

    if (bestTime !== this.state.bestTime) {
      localStorage.setItem('bestTime', bestTime);
    }

    this.setState({game, gameFinished, buttonStatus, minesLeft, bestTime});
  }

  generateGame(height, width, maximumMines) {
    const game = Game.generateArray(height, width, 0);
    let generatedMines = 0;
    let row;
    let column;

    while (generatedMines < maximumMines) {
      row = Game.randomInRange(0, height - 1);
      column = Game.randomInRange(0, width - 1);

      if (!Game.isMine(game, row, column)) {
        game[row][column] = '*';
        this.incrementMinesNearby(game, row - 1, column);
        this.incrementMinesNearby(game, row + 1, column);
        this.incrementMinesNearby(game, row, column - 1);
        this.incrementMinesNearby(game, row, column + 1);
        this.incrementMinesNearby(game, row - 1, column - 1);
        this.incrementMinesNearby(game, row - 1, column + 1);
        this.incrementMinesNearby(game, row + 1, column + 1);
        this.incrementMinesNearby(game, row + 1, column - 1);
        generatedMines++;
      }
    }

    return game;
  }

  incrementMinesNearby(squares, row, column) {
    if (this.inRange(row, column) && !Game.isMine(squares, row, column)) {
      squares[row][column] = squares[row][column] + 1;
    }
  }

  inRange(row, column) {
    return row >= 0 && row < this.height
      && column >= 0 && column < this.width;
  }

  startTimer() {
    this.setState({
      gameStarted: true,
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
            minesLeft={Game.leftPad(this.state.minesLeft)}
            time={Game.leftPad(this.state.time)}
            onClick={() => this.setState(this.getInitialState())}
          />
        </div>
        <Board
          onClick={(row, column) => this.handleClick(row, column)}
          onRightClick={(event, row, column) => this.handleRightClick(event, row, column)}
          game={this.state.game}
        />
        <div className="bestScore">
          {this.state.bestTime !== null ? 'Best time: ' + Game.leftPad(this.state.bestTime) : ''}
        </div>
      </div>
    );
  }
}

export default Game;
