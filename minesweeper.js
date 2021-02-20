var app = new Vue({
  el: '#app',
  data: {
    board: [
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "💣", clicked: false}
      ],
      [
        {content: "", clicked: false},
        {content: "💣", clicked: false},
        {content: "", clicked: false}
      ]
    ],
    interfaceWrapper: {
      display: 'flex',
      flexDirection: "column",
      justifyContent: 'center',
      alignItems: 'center',
      width: "calc(6rem + 6px)",
      height: "calc(8rem + 4px)",
      backgroundColor: "#D6D6D6",
      borderStyle: "outset",
      borderWidth: "3px",
      padding: '.5rem'
    },
    gameHeader: {
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      width: '6rem',
      height: '2rem'
    },
    boardWrapper: {
      display: 'grid',
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "repeat(3, 1fr)",
      background: '#D6D6D6',
      borderStyle: 'inset',
      borderWidth: '1.5px'
    },
    cell: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '2rem',
      height: '2rem',
      fontFamily: "VT323, monospace"
    },
    fontStyles: {
      size: {fontSize: "1.7rem"},
      blue: {color: 'blue'},
      green: {color: 'green'},
      red: {color: "red"},
      darkBlue: {color: "darkblue"}
    },
    hidden: {
      background: '#D6D6D6',
      borderStyle: "outset",
      borderWidth: "1.5px"
    },
    revealedOdd: {
      background: '#E3E3E3',
      border: '1.5px solid #E3E3E3'
    },
    revealedEven: {
      background: '#D6D6D6',
      border: '1.5px solid #D6D6D6'
    }
  },
  computed: {

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
    reveal(cell) {
      cell.clicked = true;
      
      if (cell.content === "💣") {
        return console.log("You Lose")
      } else {
        let remainingCells = this.remainingCells();
        for (let c = 0; c < remainingCells.length; c++) {
          if (remainingCells[c].content !== "💣") {
            return console.log("Keep Playing")
          }
        }
        return console.log("You Win!")
      }
    },
    revealed(i) {
      if (i % 2 === 0) {
        return this.revealedEven;
      } else {
        return this.revealedOdd;
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
            return this.bombCheck(row, col);
      }
    },
    bombCheck(row, col) {
      if (this.board[row][col].content === "💣") {
        return 1;
      }
    }
  },
  mounted() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {

        let curr = this.board[row][col];
        if (curr.content === "") {
          let nearbyBombs = 0;

          nearbyBombs += this.boundsCheck(row - 1, col) || 0;
          nearbyBombs += this.boundsCheck(row + 1, col) || 0;
          nearbyBombs += this.boundsCheck(row, col - 1) || 0;
          nearbyBombs += this.boundsCheck(row, col + 1) || 0;
          nearbyBombs += this.boundsCheck(row - 1, col - 1) || 0;
          nearbyBombs += this.boundsCheck(row - 1, col + 1) || 0;
          nearbyBombs += this.boundsCheck(row + 1, col - 1) || 0;
          nearbyBombs += this.boundsCheck(row + 1, col + 1) || 0;

          if (nearbyBombs !== 0) {
            curr.content = String(nearbyBombs);
          }
        }
      }
    }
  },
  filters: {
    //
  }
})