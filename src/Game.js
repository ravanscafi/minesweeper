import React, {Component} from 'react';
import './Game.css';
import Board from './Board';
import Status from './Status';

const EMOJI_OK = '🙂';
const EMOJI_GAME_OVER = '💀';
const EMOJI_WIN = '😎';

class Game extends Component {
  static randomInRange(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  static isMine(squares, row, column) {
    return squares[row][column] === 'M';
  }

  static generateArray(height, width, value) {
    return Array.from(
      {length: height},
      () => Array.from({length: width}, () => value)
    )
  }

  static vibrate(pattern) {
    return navigator.vibrate(pattern);
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
      sq => (sq === null || sq === 'F')
    ).length > maximumMines;
  }

  static leftPad(number) {
    return number.toString().padStart(3, '0');
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  restart(...args) {
    this.setState(this.getInitialState(...args));
  }

  getInitialState(height = 9, width = 9, maximumMines = 10) {
    this.stopTimer();

    return {
      height: height,
      width: width,
      maximumMines: maximumMines,
      minesLeft: maximumMines,
      game: Game.generateArray(height, width, null),
      solution: null,
      gameStarted: false,
      gameFinished: false,
      buttonStatus: EMOJI_OK,
      time: 0,
      start: 0,
      bestTimes: JSON.parse(localStorage.getItem('minesweeper:bestTimes')) || {},
    };
  }

  checkStart() {
    if (!this.state.gameStarted) {
      this.startTimer();
    }
  }

  handleClick(row, column) {
    let game = this.state.game.slice();
    let solution;

    if (!this.state.solution) {
      solution = this.generateGame(this.state.height, this.state.width, row, column, this.state.maximumMines);
      this.setState({gameStarted: true, solution: solution});
    } else {
      solution = this.state.solution.slice();
    }
    this.checkStart();

    if (this.state.gameFinished || game[row][column] !== null) {
      return;
    }

    this.reveal(game, solution, row, column);

    this.updateGameStatus(game, solution, row, column);
  }

  handleRightClick(event, row, column) {
    let game = this.state.game.slice();
    event.preventDefault();
    this.checkStart();

    let value = game[row][column];
    if (this.state.gameFinished
      || (value !== null && value !== 'F')) {
      return;
    }

    game[row][column] = value ? null : 'F';
    const minesLeft = this.state.minesLeft + (game[row][column] ? -1 : 1);
    Game.vibrate(200);

    this.setState({game, minesLeft});
  }

  reveal(game, solution, row, column) {
    if (!this.inRange(row, column) || game[row][column] !== null) {
      return;
    }

    game[row][column] = solution[row][column];

    if (game[row][column] === 0) {
      this.expand(game, solution, row, column);
    }
  }

  expand(game, solution, row, column) {
    this.reveal(game, solution, row - 1, column);
    this.reveal(game, solution, row + 1, column);
    this.reveal(game, solution, row, column - 1);
    this.reveal(game, solution, row, column + 1);
    this.reveal(game, solution, row - 1, column - 1);
    this.reveal(game, solution, row - 1, column + 1);
    this.reveal(game, solution, row + 1, column + 1);
    this.reveal(game, solution, row + 1, column - 1);
  }

  updateGameStatus(game, solution, row, column) {
    if (Game.isMine(game, row, column)) {
      return this.setGameOver(game, solution, row, column);
    }

    const gameFinished = !Game.thereAreRemainingMoves(game, this.state.maximumMines);
    const buttonStatus = gameFinished ? EMOJI_WIN : this.state.buttonStatus;
    let minesLeft = this.state.minesLeft;

    if (gameFinished) {
      this.stopTimer();
      game = Game.getSolution(game, solution, 'F');
      minesLeft = 0;
      Game.vibrate([300, 40, 300, 40, 300, 40, 300]);
      this.updateBestTime(this.state.time || 1);
    }

    this.setState({game, gameFinished, buttonStatus, minesLeft});
  }

  setGameOver(game, solution, row, column) {
    this.stopTimer();

    game = game.map(
      (row, rowKey) => row.map(
        (square, squareKey) => {
          const isMine = Game.isMine(solution, rowKey, squareKey);
          if (square === 'F') {
            return isMine ? square : 'W';
          }

          return isMine ? 'M' : square;
        }
      )
    );
    Game.vibrate(800);
    game[row][column] = 'C'; // differ clicked mine that led to game over

    this.setState({
      game,
      gameFinished: true,
      buttonStatus: EMOJI_GAME_OVER,
    });
  }

  generateGame(height, width, currentRow, currentColumn, maximumMines) {
    const game = Game.generateArray(height, width, 0);
    let generatedMines = 0;
    let row;
    let column;

    while (generatedMines < maximumMines) {
      row = Game.randomInRange(0, height - 1);
      column = Game.randomInRange(0, width - 1);

      if (!Game.isMine(game, row, column) && !(currentRow === row && currentColumn === column)) {
        game[row][column] = 'M';
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

  incrementMinesNearby(game, row, column) {
    if (this.inRange(row, column) && !Game.isMine(game, row, column)) {
      game[row][column] = game[row][column] + 1;
    }
  }

  inRange(row, column) {
    return row >= 0 && row < this.state.height
      && column >= 0 && column < this.state.width;
  }

  startTimer() {
    this.setState({
      gameStarted: true,
      time: 1,
      start: Date.now(),
    });
    if (this.timer) {
      this.stopTimer();
    }
    this.timer = setInterval(() => this.setState({
      time: Math.floor((Date.now() - this.state.start) / 1000) + 1,
    }), 1);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  updateBestTime(newTime) {
    const bestTimes = Object.assign({}, this.state.bestTimes);
    const bestTime = bestTimes[this.getBestTimeKey()] || null;
    if (bestTime === null || newTime < bestTime) {
      bestTimes[this.getBestTimeKey()] = newTime;
      localStorage.setItem('minesweeper:bestTimes', JSON.stringify(bestTimes));
      this.setState({bestTimes});
    }
  }

  getBestTimeText() {
    const bestTime = this.state.bestTimes[this.getBestTimeKey()] || null;
    return bestTime !== null ? 'Best time: ' + Game.leftPad(bestTime) : '';
  }

  getBestTimeKey() {
    return `${this.state.height},${this.state.width},${this.state.maximumMines}`;
  }

  render() {
    return (
      <div className="Game">
        <div className="wrapper">
          <Status
            buttonStatus={this.state.buttonStatus}
            minesLeft={Game.leftPad(this.state.minesLeft)}
            time={Game.leftPad(this.state.time)}
            onClick={() => this.restart(this.state.height, this.state.width, this.state.maximumMines)}
          />
        </div>
        <Board
          onClick={(row, column) => this.handleClick(row, column)}
          onRightClick={(event, row, column) => this.handleRightClick(event, row, column)}
          game={this.state.game}
          gameFinished={this.state.gameFinished}
        />
        <div className="bestScore">
          {this.getBestTimeText()}
        </div>
        <div>
          <button onClick={() => this.restart(9, 9, 10)}>
            Beginner
          </button>
          <button onClick={() => this.restart(16, 16, 40)}>
            Intermediate
          </button>
          <button onClick={() => this.restart(16, 30, 99)}>
            Expert
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
