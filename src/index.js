import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function all(array) {
    for (let i=0; i < array.length; i++) {
        if (array[i] === null) {
            return false;
        }
    }
    return true;
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
      return (
          <Square 
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
          />
      )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: {
                    letter: null,
                    square: null,
                },
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: {
                    letter: squares[i],
                    space: i
                },
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const win = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} (${step.lastMove.letter} @ ${step.lastMove.space})`:
                "Go to game start";
            const display_desc = (move === this.state.stepNumber) ? <b>{desc}</b> : desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{display_desc}</button>
                </li>
            );
        });

        let status;
        let squares;
        if (win) {
            status = 'Winner: ' + current.squares[win[0]];
            squares = current.squares.map((letter, index) => {
                return win.includes(index) ? <u>{letter}</u> : letter;
            });
        } else {
            status = (all(current.squares) ? 
                "It's a draw." : 
                'Next Player: ' + (this.state.xIsNext ? 'X' : 'O'));
            squares = current.squares;
        }

        return (
          <div className="game">
            <div className="game-board">
                <Board 
                    squares = {squares}
                    onClick = {(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{moves}</ol>
            </div>
          </div>
        );
    }
}

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
    ]
    for (let i=0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a,b,c];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

