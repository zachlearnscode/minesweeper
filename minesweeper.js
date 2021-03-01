var app = new Vue({
  el: '#app',
  data: {
    rows: undefined,
    cols: undefined,
    bombs:  undefined,
    board: undefined,
    boardKey: 0,
    difficulty: "medium",
    gameStarted: false,
    gameEnded: false,
    timeElapsed: 0,
    interval: null,
    vertical: false,
    backgroundStore: '',
    isMobile: false
  },
  methods: {
    frameBoard() {
      let board = [];
  
      let x = 0;
      while (x < this.rows) {
        let row = [];
  
        let y = 0;
        while (y < this.cols) {
          row.push({content: "", hidden: true, marked: false});
          y++;
        }
  
        board.push(row);
        x++;
      }
  
      return board;
    },
    finishBoard(row, col) {
      let board = this.board.slice();
      let givenRow = row, givenCol = col;
      let revealedCellNeighbors = this.findNeighbors(board, row, col);

      let coordinateBombs = () => {
        let bombCoordinates = [];
    
        let createCoordinates = () => {
          let row = Math.floor(Math.random() * this.rows);
          let col = Math.floor(Math.random() * this.cols);

          if (!revealedCellNeighbors
                .some(n => n.row === row && n.col === col) &&
                row !== givenRow && col !== givenCol) {
            return {row, col};
          } else {
            return createCoordinates();
          }
        }
    
        let preventDuplicates = ({row, col}) => {
          if (!bombCoordinates
                .some(c => c.row === row && c.col === col)) {
            return bombCoordinates.push({row, col})
          } else {
            return preventDuplicates(createCoordinates());
          }
        }
    
        do {
          preventDuplicates(createCoordinates());
        } while (bombCoordinates.length < this.bombs);
  
        return bombCoordinates;
      }
    
      let placeBombs = (coordinates) => {
        return coordinates
          .forEach(coords => board[coords.row][coords.col].content = "💣");
      }
    
      let setClues = () => {
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
      }

      placeBombs(coordinateBombs());
      setClues();

      return board;

    },
    reveal(row, col) {
      if (this.gameEnded) {
        return;
      }

      if (!this.gameStarted) {
        this.board = this.finishBoard(row, col);
        this.gameStarted = true;
        this.startTimer();
      }

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
    },
  
    evaluateForWin() {
      if (this.hiddenCells.some(c => !c.content || c.content !== "💣")) {
        return;
      } else {
        return this.gameWon(this.hiddenCells);
      }
    },
  
    gameOver(cell) {
      cell.content = "❌";
      this.bombCells.forEach(b => {
        let index = this.bombCells.indexOf(b);
        let randomTimeout = Math.random() * 30;
        setTimeout(() => b.hidden = false, index * randomTimeout)
      });
      this.stopTimer();
      this.gameEnded = true;
    },
  
    gameWon(arr) {
      arr.forEach(c => {
        c.marked = false;
        c.hidden = false;
      })
      this.stopTimer();
      this.gameEnded = true;
    },
  
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
    },
  
    boundsCheck(board, row, col) {
      if (row > -1 && row < board.length &&
          col > -1 && col < board[row].length) {
            return {row, col};
      } else {
        return undefined;
      }
    },
  
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
  
      possibleNeighbors.map(c => inboundsNeighbors.push(this.boundsCheck(board, c.row, c.col)));
      
      return inboundsNeighbors.filter(neighbor => neighbor);
    },
    newGame() {
      this.gameEnded = false;
      this.boardKey++;

      if (this.interval) {
        this.stopTimer();
        this.gameStarted = false;
        this.timeElapsed = 0;
      }

      if (this.difficulty === "easy") {
        if (!this.isMobile) {
          this.rows = 8;
          this.cols = 10;
        } else {
          this.rows = 10;
          this.cols = 7;
        }
        this.bombs = 10;
      } else if (this.difficulty === "medium") {
        if (!this.isMobile) {
          this.rows = 14;
          this.cols = 18;
          this.bombs = 40;
        } else{
          this.rows = 16;
          this.cols = 12;
          this.bombs = 35
        } 
      } else {
        if (!this.isMobile) {
          this.rows = 20;
          this.cols = 24;
          this.bombs = 99;
        } else {
          this.rows = 21;
          this.cols = 16;
          this.bombs = 75;
        }
      }

      let board = this.frameBoard();
      
      return this.board = board;
    },
    startTimer() {
      return this.interval = setInterval(() => {
            this.timeElapsed++;
          }, 1000);
    },
    stopTimer() {
      clearInterval(this.interval);
    },
    highlight(index) {
      let el = this.$refs.cell[index];
      if (el.style.backgroundColor === "rgb(142, 204, 57)" ||
          el.style.backgroundColor === "rgb(167, 217, 72)") {
            this.backgroundStore = el.style.backgroundColor;
            el.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
      } else {
        if (el.innerText) {
          this.backgroundStore = el.style.backgroundColor;
          el.style.backgroundColor = "rgba(255, 255, 255, 0.8)"
        }
      }
    },
    restore(index) {
      let el = this.$refs.cell[index];
      if (el.style.backgroundColor === "rgba(255, 255, 255, 0.8)") {
        el.style.backgroundColor = this.backgroundStore;
        this.backgroundColor = "";
      }
    },
    detectMobile() {
      let w = window.innerWidth;

      if (w <= 600) {
        return this.isMobile = true;
      } else {
        return;
      }
    },
    boardWidth(rows, cols) {
      let top = Math.abs(rows - cols);
      let bottom = Math.round((rows + cols) / 2);

      return top / bottom * 100;
    }
  },
  computed: {
    flagsAvailable() {
      let markedCells = this.board.flat()
        .filter(c => c.marked).length;

      return this.bombs - markedCells;
    },
    hiddenCells() {
      return this.board.flat().filter(c => c.hidden);
    },
    bombCells() {
      return this.board.flat().filter(c => c.content === "💣");
    },
    heightInPixels() {
      return document.getElementById("board").clientHeight;
    },
    styles() {
      return {
        wrapper: {
          height: 'calc(100vh - 3rem)',
          width: `100vw`,
          display: 'flex',
          justifyContent:'center',
          alignItems: 'center',
          padding: '1rem'
        },
        board: {
          height: this.isMobile ? `calc(90vw * ${this.rows/this.cols})` : '80vh',
          width: this.isMobile ? '90vw' : `calc(80vh * ${this.cols/this.rows})`,
          display: "grid",
          gridTemplateRows: `repeat(${this.rows}, 1fr)`,
          boxShadow: '10px 10px 10px #4a752c'
        },
        row: {
          display: 'grid',
          gridTemplateColumns: `repeat(${this.cols}, 1fr)`
        },
        cell: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: "Rubik, sans-serif",
          fontSize: this.isMobile ? '.8rem' : '1rem'
        },
        colorizeCell: (row, col, hidden) => {
          
          if (hidden) {
            if (row % 2 === 0) {
              if (col % 2 === 0) {
                return {backgroundColor: '#8ecc39'};
              } else {
                return {backgroundColor: '#a7d948'};
              }
            } else {
              if (col % 2 === 0) {
                return {backgroundColor: '#a7d948'};
              } else {
                return {backgroundColor: '#8ecc39'};
              }
            }
          } else {
            if (row % 2 === 0) {
              if (col % 2 === 0) {
                return {backgroundColor: '#d7b899'};
              } else {
                return {backgroundColor: '#e5c29f'};
              }
            } else {
              if (col % 2 === 0) {
                return {backgroundColor: '#e5c29f'};
              } else {
                return {backgroundColor: '#d7b899'};
              }
            }
          }
        },
        colorizeClues: (clueVal) => {
          if (Number(clueVal) === 1) {
            return {color: 'blue'};
          } else if (Number(clueVal) === 2) {
            return {color: 'green'};
          } else if (Number(clueVal) === 3) {
            return {color: 'red'};
          } else if (Number(clueVal) === 4) {
            return {color: 'darkBlue'};
          } else if (Number(clueVal) === 5) {
            return {color: 'maroon'};
          } else if (Number(clueVal) === 6) {
            return {color: 'lightSeaGreen'};
          } else if (Number(clueVal) === 7) {
            return {color: 'black'};
          } else if (Number(clueVal) === 8) {
            return {color: 'gray'};
          } 
        }
      }
    }
  },
  filters: {
    padTime(num) {
      let time = String(num);
      while (time.length < 3) {
        time = "0" + time;
      }
      return time;
    }
  },
  created() {
    this.detectMobile();
    this.newGame();
  }
})