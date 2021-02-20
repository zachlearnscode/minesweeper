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
    remainingBoard: this.unclickedCells,
    wrapper: {
      width: '6rem',
      height: '6rem',
      display: 'grid',
      gridTemplateColumns: "2rem 2rem 2rem",
      gridTemplateRows: "2rem 2rem 2rem",
      background: '#D6D6D6'
    },
    cell: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '2rem',
      height: '2rem',
      background: '#D6D6D6',
      fontFamily: "VT323, monospace"
    },
    fontSize: {
      fontSize: "1.7rem"
    },
    hidden: {
      borderStyle: "outset"
    },
    revealed: {
      border: '0.5px solid darkgray'
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
  }
})