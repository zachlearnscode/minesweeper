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
      background: '#D6D6D6'
    },
    unclicked: {
      borderStyle: "outset"
    },
    clicked: {
      border: '0.5px solid darkgray'
    }
  },
  beforeMount() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        let nearbyBombs = 0;

        if (this.board[row][col].content !== "💣") {
          //above
          if (row - 1 > -1) {
            if (this.board[row - 1][col].content === "💣") {
              nearbyBombs++;
            }
          }
          //below
          if (row + 1 < this.board.length) {
            if (this.board[row + 1][col].content === "💣") {
              nearbyBombs++;
            }
          }
          //left
          if (col - 1 > -1) {
            if (this.board[row][col - 1].content === "💣") {
              nearbyBombs++;
            }
          }
          //right 
          if (col + 1 < this.board[row].length) {
            if (this.board[row][col + 1].content === "💣") {
              nearbyBombs++;
            }
          }
          //above left
          if (row - 1 > -1 && col - 1 > -1) {
            if (this.board[row - 1][col - 1].content === "💣") {
              nearbyBombs++;
            }
          }
          //above right
          if (row - 1 > -1 && col + 1 < this.board[row].length) {
            if (this.board[row - 1][col + 1].content === "💣") {
              nearbyBombs++;
            }
          }
          //below left 
          if (row + 1 < this.board.length && col - 1 > -1) {
            if (this.board[row + 1][col - 1].content === "💣") {
              nearbyBombs++;
            }
          }
          //below right
          if (row + 1 < this.board.length && col + 1 < this.board[row].length) {
            if (this.board[row + 1][col + 1].content === "💣") {
              nearbyBombs++;
            }
          }
          this.board[row][col].content = String(nearbyBombs)
        }
      }
    }
  }
})