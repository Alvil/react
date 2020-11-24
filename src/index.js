import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return(
    <button
      // check if this square caused the win
      // and change its class accordingly
      className={
        props.position === props.winningSquares[0] ||
          props.position === props.winningSquares[1] ||
          props.position === props.winningSquares[2]
          ? "square winning-square" : "square"}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // pass the variables to square
  // with position being the position of the square
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        position = {i}
        winningSquares = {this.props.winningSquares}
    />
    );
  }

  // creates the 9X9 board using for loop
  // and assigns the classname
  createBoard() {
    let rows = [];
    let loc = 0
    for (let row = 0; row < 3; row++){
      let cols = [];
      for (let col = 0; col < 3 ; col++){
        let coords = [row, col]
        cols.push(
          <div key={coords} className="board-col">
          {this.renderSquare(loc)}
          </div>
          )
        loc ++
      }
      rows.push(
        <div key={row} className="board-row">
          {cols}
        </div>
      )
    }
    return rows
  }

  render() {
    return(
      <div>{this.createBoard()}</div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickedSquare: null,
        moveMade: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      clickedButton: null,
      isAscending: true,
    };
  }

  // handles what will happen when the user clicked the squares
  // clicked square was the last clicked square (0-8)
  // clicked button checks whether the last clicked was a square or a button on the right
  // history records the states of the board
  // xIsNext is for knowing whose turn it is
  handleClickOnSquare(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickedSquare: i,
        moveMade: this.state.xIsNext ? 'X' : 'O',
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      clickedButton: history.length,
    })
  }

  // function to jump to different states of the board
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ===0,
      clickedButton: step,
    });
  }

  // returns the square filled on a state
  showClickedSquare(step) {
    const retrieveHistory = this.state.history[step];
    const clickedSquare = retrieveHistory.clickedSquare;
    if (clickedSquare < 3) {
      return [clickedSquare + 1, 1];
    } else if (clickedSquare < 6) {
      return [clickedSquare - 2, 2];
    } else {
      return [clickedSquare - 5, 3];
    }
  }

  // returns move made on a state, whether its x or o
  showMoveMade(step) {
    const retrieveHistory = this.state.history[step];
    return retrieveHistory.moveMade;
  }

  // creates the 1 2 3 at the top of the board
  createColLabel() {
    let colLabel = []
    for (let i = 1; i < 4; i++) {
      colLabel.push(
        <div key={i} className="col-label">
          <p>{i}</p>
        </div>
      )
    }
    return colLabel
  }

  // creates the 1 2 3 at the right of the board
  createRowLabel() {
    let rowLabel = []
    for (let i = 1; i < 4; i++) {
      rowLabel.push(
        <div key={i} className="row-label">
          <p>{i}</p>
        </div>
      )
    }
    return rowLabel
  }

  // function to change isAscending on click
  changeIsAscending() {
    this.setState({
      isAscending: !this.state.isAscending
    })
  }

  // creates the button for changing between ascending and descending
  rearrangeButton() {
    return(
      <button onClick={() => this.changeIsAscending()} className="sort-button">
        {!this.state.isAscending ? "Sort by ascending" : "Sort by descending"}
      </button>
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = checkDraw(current.squares);

    // tracks the squares that caused the win
    let winningSquares = []
    if (winner) {
      winningSquares = winner.slice(1,4)
    }

    // tracks the states of the game and updates it accordingly
    // shows the current active state by highlighting it
    // lets the user jump to different states of the board
    // can be sorted by either ascending or descending
    const moves = history.map((step, move) => {
      if (this.state.isAscending) {
      } else {
        move = this.state.history.length - 1 - move
      }

      const desc = move ?
          'Move #' + move + ', ' + this.showMoveMade(move) + ' @ (' + this.showClickedSquare(move) + ')'
          : 'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}
                    className={this.state.clickedButton === move ? "moves-button selected" : "moves-button"}>
              {desc}
            </button>
          </li>
        );
    })

    // shows the winner of the game and if it is a draw
    let status;
    if (winner) {
      status = 'Winner ' + winner[0];
    } else if (!winner && draw) {
      status = 'The game is a draw!';
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="outer">
        <div className="inner before-col-label">
          {this.createColLabel()}
        </div>
        <div className="game inner">
          <div className="before-row-label">{this.createRowLabel()}</div>

          <div className="game-board">
            <Board
            squares={current.squares}
            onClick={i => this.handleClickOnSquare(i)}
            winningSquares={winningSquares}
            />
          </div>

          <div className="game-info">
            <div>{status}</div>
            <div>{this.rearrangeButton()}</div>
            <ul>{moves}</ul>
          </div>
        </div>
      </div>
    );
  }
}

// checks if there is a winner and returns who won and the squares that caused the win
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c]
    }
  }
  return null;
}

// checks if the game is a draw (all the squares are filled up)
function checkDraw(squares) {
  let draw = null;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ];
  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === null || squares[b] === null || squares[c] === null) {
      draw = false
      i = lines.length
    } else {
      draw = true
    }
  }
  return draw
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
