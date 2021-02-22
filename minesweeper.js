var app = new Vue({
  el: '#app',
  data: {
    board: [
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "💣", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false}
      ]
    ],
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
  methods: {
    remainingCells() {
      let remaining = [];
      let board = this.board.flat();

      for (let i = 0; i < board.length; i++) {
        if (!board[i].clicked) {
          remaining.push(board[i]);
        }
      }

      return remaining;
    },
    reveal(row, col) {
      let cell = this.board[row][col];

      if (cell.content &&
          cell.content != "💣") {
        return cell.clicked = true;
      } else if (!cell.content) {
        cell.clicked = true;
        return this.revealAdjacent(row, col); 
      } else {
        return cell.clicked = true;
      }
    },
    revealAdjacent(row, col) {
      let adjacentCells = [
        {row: row - 1, col: col - 1},
        {row: row - 1, col: col},
        {row: row - 1, col: col + 1},
        {row: row, col: col + 1},
        {row: row + 1, col: col + 1},
        {row: row + 1, col: col},
        {row: row + 1, col: col - 1},
        {row: row, col: col - 1}
      ];

      for (let i = 0; i < adjacentCells.length; i++) {
        let cell = this.boundsCheck(adjacentCells[i].row, adjacentCells[i].col);

        if (cell) {
          if (!cell.clicked) {
            cell.clicked = true;
            if (!cell.content) {
              this.revealAdjacent(adjacentCells[i].row, adjacentCells[i].col)
            }
          }
        }
      }
    },
    colorCell(row, col, clicked) {
      if (row % 2 === 0) {
        if (col % 2 === 0) {
          if (!clicked) {
            return this.hiddenDark;
          } else {
            return this.revealedDark;
          }
        } else {
          if (!clicked) {
            return this.hiddenLight;
          } else {
            return this.revealedLight;
          }
        }
      } else {
        if (col % 2 === 0) {
          if (!clicked) {
            return this.hiddenLight;
          } else {
            return this.revealedLight;
          }
        } else {
          if (!clicked) {
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
    },
    boundsCheck(row, col) {
      if (row > -1 && row < this.board.length &&
          col > -1 && col < this.board[row].length) {
            return this.board[row][col];
      } else {
        return undefined;
      }
    },
    bombCheck(coords) {
      if (coords) {
        if (coords.content === "💣") {
          return 1;
        } 
      }
      
    }
  },
  mounted() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {

        let curr = this.board[row][col];
        if (curr.content === "") {
          let nearbyBombs = 0;

          nearbyBombs += this.bombCheck(this.boundsCheck(row - 1, col)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row + 1, col)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row, col - 1)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row, col + 1)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row - 1, col - 1)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row - 1, col + 1)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row + 1, col - 1)) || 0;
          nearbyBombs += this.bombCheck(this.boundsCheck(row + 1, col + 1)) || 0;

          if (nearbyBombs !== 0) {
            curr.content = String(nearbyBombs);
          }
        }
      }
    }
  }
})