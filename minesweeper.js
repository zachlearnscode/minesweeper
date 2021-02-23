class Gameboard {
  constructor(rows, cols, bombs) {
    this.rows = rows;
    this.cols = cols;
    this.bombs = bombs;
    this.board = undefined;
    this.setup = {
      frameBoard: () => {
        let board = [];
    
        let x = 0;
        while (x < this.rows) {
          let row = [];
    
          let y = 0;
          while (y < this.cols) {
            row.push(new Cell());
            y++;
          }
    
          board.push(row);
          x++;
        }
    
        return board;
      },
    
      coordinateBombs: () => {
        let bombCoordinates = [];
    
        let createCoordinates = () => {
          let row = Math.floor(Math.random() * this.rows);
          let col = Math.floor(Math.random() * this.cols);
    
          return {row, col};
        }
    
        let preventDuplicates = ({row, col}) => {
          if (!bombCoordinates.some(c => c.row === row && c.col === col)) {
            return bombCoordinates.push({row, col})
          } else {
            return preventDuplicates(createCoordinates());
          }
        }
    
        do {
          preventDuplicates(createCoordinates());
        } while (bombCoordinates.length < this.bombs);

        return bombCoordinates;
      },
    
      placeBombs: (board, coordinates) => {
        board = board.slice();
        coordinates.forEach(coords => board[coords.row][coords.col].content = "💣");
  
        return board;
      },
    
      setClues: (board) => {
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            let cell = board[row][col], nearbyBombs = 0;
    
            function bombCheck({row, col}) {
              if (board[row][col].content === "💣") {
                return 1;
              } else {
                return 0;
              }
            }
            
            if (!cell.content) {
              let neighbors = this.findNeighbors(board, row, col);
              neighbors.forEach(coords => {
                nearbyBombs += bombCheck(coords)
              })
              
      
              if (nearbyBombs !== 0) {
                cell.content = String(nearbyBombs);
              }
            }            
          }
        }
        return board;
      }
    }
  }

  buildBoard() {
    let frame = this.setup.frameBoard();
    let bombCoordinates = this.setup.coordinateBombs();

    let board = this.setup.setClues(this.setup.placeBombs(frame, bombCoordinates));

    return this.board = board;
  }

  reveal(row, col) {
    let cell = this.board[row][col];

    if (!cell.marked) {
      cell.hidden = false;

      if (cell.content === "💣") {
        return this.gameOver(cell)
      } else if (!cell.content) {
        this.revealNeighbors(this.board, row, col);
      }

      return this.evaluateForWin();
    }
  }

  evaluateForWin() {
    let remainingCells = this.board.flat()
      .filter(c => c.hidden);

    if (remainingCells.some(c => !c.content || c.content !== "💣")) {
      return;
    } else {
      return this.gameWon(remainingCells);
    }
  }

  gameOver(cell) {
    let allBombs = this.board.flat()
      .filter(c => c.content === "💣");

    allBombs.forEach(b => b.hidden = false);

    cell.content = "❌";
  }

  gameWon(arr) {
    arr.forEach(c => {
      c.marked = false;
      c.hidden = false;
    })
  }

  revealNeighbors(board, row, col) {
    let neighborCoords = this.findNeighbors(board, row, col);

    neighborCoords.forEach(coords => {
      let neighbor = this.board[coords.row][coords.col];

      if (neighbor.hidden && !neighbor.marked) {
        neighbor.hidden = false;
        if (!neighbor.content)
        this.revealNeighbors(this.board, coords.row, coords.col);
      }
    })
  }

  boundsCheck(board, row, col) {
    if (row > -1 && row < board.length &&
        col > -1 && col < board[row].length) {
          return {row, col};
    } else {
      return undefined;
    }
  }

  findNeighbors(board, row, col) {
    let inboundsNeighbors = [];
    let possibleNeighbors = [
      {row: row - 1, col: col - 1},
      {row: row - 1, col: col},
      {row: row - 1, col: col + 1},
      {row: row, col: col + 1},
      {row: row + 1, col: col + 1},
      {row: row + 1, col: col},
      {row: row + 1, col: col - 1},
      {row: row, col: col - 1}
    ];

    possibleNeighbors.forEach(c => inboundsNeighbors.push(this.boundsCheck(board, c.row, c.col)));
    
    return inboundsNeighbors.filter(neighbor => neighbor);
  }
}

class Cell {
  constructor() {
    this.content = "";
    this.hidden = true;
    this.marked = false;
  }
}

var app = new Vue({
  el: '#app',
  data: {
    gameObj: undefined,
    gameboard: undefined,
    difficulty: "medium",
    timeElapsed: 0,
    interfaceWrapper: {
      
      width: "10rem",
      backgroundColor: "#D6D6D6",
      borderStyle: "outset",
      borderWidth: "3px",
      padding: '.5rem'
    },
    gameHeader: {
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      width: '10rem',
      height: '2rem'
    },
    boardWrapper: {
      width: '20rem',
      height: `calc(20rem * .8)`,
      background: '#D6D6D6',
      display: 'grid',
      gridTemplateColumns: '1fr'
    },
    boardRow: {
      width: '20rem',
      height: '2rem',
      display: 'flex'
    },
    cell: {
      width: '2rem',
      height: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "VT323, monospace"
    },
    hiddenDark: {
      backgroundColor: '#33CC33'
    },
    hiddenLight: {
      backgroundColor: '#66FF66'
    },
    revealedDark: {
      backgroundColor: '#FFCC00'
    },
    revealedLight: {
      backgroundColor: '#FFCC66'
    },
    fontStyles: {
      size: {fontSize: "1.7rem"},
      blue: {color: 'blue'},
      green: {color: 'green'},
      red: {color: "red"},
      darkBlue: {color: "darkblue"}
    },
    hidden: {
      background: '#D6D6D6'
    },
    revealedOdd: {
      background: '#E3E3E3'
    },
    revealedEven: {
      background: '#D6D6D6'
    }
  },
  computed: {
    flagsRemaining() {
      let markedCells = this.gameboard.flat()
        .filter(c => c.marked).length;

      return this.gameObj.bombs - markedCells;
    }
  },
  methods: {
    newGame() {
      if (this.difficulty === "easy") {
        this.gameObj = new Gameboard(8, 10, 10);
      } else if (this.difficulty === "medium") {
        this.gameObj = new Gameboard(14, 18, 40);
      } else {
        this.gameObj = new Gameboard(20, 24, 99);
      }
      
      this.gameObj.buildBoard();

      return this.gameboard = this.gameObj.board;
    },
    startTimer() {
      this.countInterval = setInterval(() => {
        this.timeElapsed++;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.countInterval);
    },
    colorCell(row, col, hidden) {
      if (row % 2 === 0) {
        if (col % 2 === 0) {
          if (hidden) {
            return this.hiddenDark;
          } else {
            return this.revealedDark;
          }
        } else {
          if (hidden) {
            return this.hiddenLight;
          } else {
            return this.revealedLight;
          }
        }
      } else {
        if (col % 2 === 0) {
          if (hidden) {
            return this.hiddenLight;
          } else {
            return this.revealedLight;
          }
        } else {
          if (hidden) {
            return this.hiddenDark;
          } else {
            return this.revealedDark;
          }
        }
      }
    },
    colorize(num) {
      if (Number(num) === 1) {
        return this.fontStyles.blue;
      } else if (Number(num) === 2) {
        return this.fontStyles.green;
      } else if (Number(num) === 3) {
        return this.fontStyles.red;
      } else if (Number(num) === 4) {
        return this.fontStyles.darkBlue;
      } else {
        return '';
      }
    }
  }
})