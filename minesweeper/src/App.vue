<template>
  <v-app>
    <v-main class="d-flex justify-center align-center light-green lighten-3">
      <v-container
        class="wrapper d-flex flex-column pa-0"
        :style="styles.wrapper"
      >
        <div
          style="height: 56px"
          class="light-green darken-3 d-flex space-between"
        >
          <div style="width: 75%">
            <v-btn-toggle dark group mandatory v-model="difficulty">
              <v-btn value="easy"> {{ this.isMobile ? "E" : "Easy" }} </v-btn>
              <v-btn value="medium" selected>
                {{ this.isMobile ? "M" : "Medium" }}
              </v-btn>
              <v-btn value="hard"> {{ this.isMobile ? "H" : "Hard" }} </v-btn>
            </v-btn-toggle>
            <v-btn icon class="ml-sm-2" @click="newGame">
              <v-icon color="white">mdi-refresh</v-icon>
            </v-btn>
          </div>
          <div
            style="width: 25%"
            class="d-flex flex-column flex-sm-row justify-center justify-sm-end align-end align-sm-center px-3"
          >
            <div class="mr-sm-2 text-right text-sm-h5 white--text">
              🚩 {{ flagsAvailable }}
            </div>
            <div class="text-sm-h5 white--text">
              ⏲️ {{ timeElapsed | padTime }}
            </div>
          </div>
        </div>

        <div :key="boardKey" :style="styles.board">
          <div
            v-for="(row, rowIndex) in board"
            :key="rowIndex"
            :style="styles.row"
          >
            <div
              v-for="(col, colIndex) in row"
              :key="colIndex"
              class="text-body-1 font-weight-bold font-weight-sm-regular text-sm-h5"
              ref="cell"
              :style="[
                styles.cell,
                styles.colorizeCell(rowIndex, colIndex, col.hidden),
                styles.colorizeClues(col.content),
              ]"
              @click="reveal(rowIndex, colIndex)"
              @click.middle.prevent="revealChord(rowIndex, colIndex)"
              v-touch="{
                left: () => (revealChord(rowIndex, colIndex)),
                right: () => (col.marked = !col.marked),
              }"
              @click.right.prevent="col.marked = !col.marked"
              @mouseover="this.isMobile ? '' : highlight(board.flat().indexOf(col))"
              @mouseleave="this.isMobile ? '' : restore(board.flat().indexOf(col))"
            >
              {{ col.hidden ? (col.marked ? "🚩" : "") : col.content }}
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <v-dialog v-model="gameWon" height="350px" width="500px">
      <v-card rounded>
        <v-container>
          <v-row>
            <v-col class="text-h4 text-center">You win!</v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex flex-column align-center">
              <span class="font-weight-bold">Difficulty:</span>
              <span>{{
                difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
              }}</span>
            </v-col>
            <v-col class="d-flex flex-column align-center">
              <span class="font-weight-bold">Your Time:</span>
              <span>{{ timeElapsed }} seconds</span>
            </v-col>
            <v-col class="d-flex flex-column align-center">
              <span class="font-weight-bold">Your Best Time:</span>
              <span>{{ bestTimeAtDifficulty() }} seconds</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-center">
              <v-btn color="green" dark block @click="newGame"
                >Play Again?</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: "Minesweeper",

  data() {
    return {
      rows: undefined,
      cols: undefined,
      bombs: undefined,
      board: undefined,
      boardKey: 0,
      difficulty: "medium",
      gameStarted: false,
      gameEnded: false,
      gameWon: false,
      timeElapsed: 0,
      interval: null,
      backgroundStore: "",
      isMobile: false,
    };
  },
  methods: {
    autoWin() {
      this.board.flat().forEach((c) => {
        if (c.content !== "💣") {
          c.hidden = false;
        }
      });
      return this.evaluateForWin();
    },
    frameBoard() {
      let board = [];

      let x = 0;
      while (x < this.rows) {
        let row = [];

        let y = 0;
        while (y < this.cols) {
          row.push({ content: "", hidden: true, marked: false });
          y++;
        }

        board.push(row);
        x++;
      }

      return board;
    },
    finishBoard(row, col) {
      let board = this.board.slice();
      let givenRow = row,
        givenCol = col;
      let revealedCellNeighbors = this.findNeighbors(board, row, col);

      let coordinateBombs = () => {
        let bombCoordinates = [];

        let createCoordinates = () => {
          let row = Math.floor(Math.random() * this.rows);
          let col = Math.floor(Math.random() * this.cols);

          if (
            !revealedCellNeighbors.some(
              (n) => n.row === row && n.col === col
            ) &&
            row !== givenRow &&
            col !== givenCol
          ) {
            return { row, col };
          } else {
            return createCoordinates();
          }
        };

        let preventDuplicates = ({ row, col }) => {
          if (!bombCoordinates.some((c) => c.row === row && c.col === col)) {
            return bombCoordinates.push({ row, col });
          } else {
            return preventDuplicates(createCoordinates());
          }
        };

        do {
          preventDuplicates(createCoordinates());
        } while (bombCoordinates.length < this.bombs);

        return bombCoordinates;
      };

      let placeBombs = (coordinates) => {
        return coordinates.forEach(
          (coords) => (board[coords.row][coords.col].content = "💣")
        );
      };

      let setClues = () => {
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            let cell = board[row][col],
              nearbyBombs = 0;

            let bombCheck = ({ row, col }) => {
              if (board[row][col].content === "💣") {
                return 1;
              } else {
                return 0;
              }
            };

            if (!cell.content) {
              let neighbors = this.findNeighbors(board, row, col);
              neighbors.forEach((coords) => {
                nearbyBombs += bombCheck(coords);
              });

              if (nearbyBombs !== 0) {
                cell.content = String(nearbyBombs);
              }
            }
          }
        }
      };

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
          return this.gameOver(cell);
        } else if (!cell.content) {
          this.revealNeighbors(this.board, row, col);
        }

        return this.evaluateForWin();
      }
    },

    revealChord(row, col) {
      let cell = this.board[row][col];

      if (!cell.hidden && cell.content) {
        let cellContent = Number(cell.content);

        let neighbors = this.findNeighbors(this.board, row, col);

        let flaggedNeighbors = 0;
        neighbors.forEach((n) => {
          let neighbor = this.board[n.row][n.col];
          if (neighbor.marked) {
            flaggedNeighbors++;
          }
        });

        if (flaggedNeighbors === cellContent) {
          neighbors.forEach((n) => {
            let neighbor = this.board[n.row][n.col];
            if (!neighbor.marked && neighbor.hidden) {
              neighbor.hidden = false;
              if (neighbor.content === "💣") {
                return this.gameOver(neighbor);
              } else if (!neighbor.content) {
                this.revealNeighbors(this.board, n.row, n.col);
              } else {
                return;
              }
            }
          });
        }
      } else {
        return;
      }
    },

    evaluateForWin() {
      if (this.hiddenCells.some((c) => !c.content || c.content !== "💣")) {
        return;
      } else {
        return this.bombsSwept(this.hiddenCells);
      }
    },

    gameOver(cell) {
      cell.content = "❌";

      this.bombCells.forEach((b) => {
        let index = this.bombCells.indexOf(b);
        let randomTimeout = Math.random() * 30;
        setTimeout(() => (b.hidden = false), index * randomTimeout);
      });

      this.stopTimer();
      this.gameEnded = true;
    },

    bombsSwept(arr) {
      arr.forEach((c) => {
        c.marked = false;
        c.hidden = false;
      });

      this.stopTimer();
      this.storeTime();
      this.gameEnded = true;
      this.gameWon = true;
    },

    storeTime() {
      if (!localStorage.getItem(this.difficulty)) {
        return localStorage.setItem(this.difficulty, this.timeElapsed);
      } else {
        let bestTime = localStorage.getItem(this.difficulty);
        if (this.timeElapsed < bestTime) {
          return localStorage.setItem(this.difficulty, this.timeElapsed);
        } else {
          return;
        }
      }
    },

    revealNeighbors(board, row, col) {
      let neighborCoords = this.findNeighbors(board, row, col);

      neighborCoords.forEach((coords) => {
        let neighbor = this.board[coords.row][coords.col];

        if (neighbor.hidden && !neighbor.marked) {
          neighbor.hidden = false;
          if (!neighbor.content)
            this.revealNeighbors(this.board, coords.row, coords.col);
        }
      });
    },

    boundsCheck(board, row, col) {
      if (
        row > -1 &&
        row < board.length &&
        col > -1 &&
        col < board[row].length
      ) {
        return { row, col };
      } else {
        return undefined;
      }
    },

    findNeighbors(board, row, col) {
      let inboundsNeighbors = [];
      let possibleNeighbors = [
        { row: row - 1, col: col - 1 },
        { row: row - 1, col: col },
        { row: row - 1, col: col + 1 },
        { row: row, col: col + 1 },
        { row: row + 1, col: col + 1 },
        { row: row + 1, col: col },
        { row: row + 1, col: col - 1 },
        { row: row, col: col - 1 },
      ];

      possibleNeighbors.map((c) =>
        inboundsNeighbors.push(this.boundsCheck(board, c.row, c.col))
      );

      return inboundsNeighbors.filter((neighbor) => neighbor);
    },
    newGame() {
      this.gameEnded = false;
      this.gameWon = false;
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
        } else {
          this.rows = 16;
          this.cols = 12;
          this.bombs = 35;
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

      return (this.board = board);
    },
    startTimer() {
      return (this.interval = setInterval(() => {
        this.timeElapsed++;
      }, 1000));
    },
    stopTimer() {
      clearInterval(this.interval);
    },
    highlight(index) {
      let el = this.$refs.cell[index];
      if (
        el.style.backgroundColor === "rgb(142, 204, 57)" ||
        el.style.backgroundColor === "rgb(167, 217, 72)"
      ) {
        this.backgroundStore = el.style.backgroundColor;
        el.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      } else {
        if (el.innerText) {
          this.backgroundStore = el.style.backgroundColor;
          el.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
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
        return (this.isMobile = true);
      } else {
        return;
      }
    },
    bestTimeAtDifficulty() {
      return localStorage.getItem(this.difficulty);
    },
  },
  computed: {
    flagsAvailable() {
      let markedCells = this.board.flat().filter((c) => c.marked).length;

      return this.bombs - markedCells;
    },
    hiddenCells() {
      return this.board.flat().filter((c) => c.hidden);
    },
    bombCells() {
      return this.board.flat().filter((c) => c.content === "💣");
    },
    styles() {
      return {
        wrapper: {
          height: this.isMobile
            ? `calc(90vw * ${this.rows / this.cols} + 56px)`
            : "calc(90vh + 56px)",
          width: this.isMobile
            ? "90vw"
            : `calc(90vh * ${this.cols / this.rows})`,
          boxShadow: "10px 10px 10px #4a752c",
        },
        board: {
          height: "100%",
          width: "100%",
          display: "grid",
          gridTemplateRows: `repeat(${this.rows}, 1fr)`,
        },
        row: {
          display: "grid",
          gridTemplateColumns: `repeat(${this.cols}, 1fr)`,
        },
        cell: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: this.isMobile ? ".7rem" : "1rem",
        },
        colorizeCell: (row, col, hidden) => {
          if (hidden) {
            if (row % 2 === 0) {
              if (col % 2 === 0) {
                return { backgroundColor: "#7CB342" };
              } else {
                return { backgroundColor: "#9CCC65" };
              }
            } else {
              if (col % 2 === 0) {
                return { backgroundColor: "#9CCC65" };
              } else {
                return { backgroundColor: "#7CB342" };
              }
            }
          } else {
            if (row % 2 === 0) {
              if (col % 2 === 0) {
                return { backgroundColor: "#d7b899" };
              } else {
                return { backgroundColor: "#e5c29f" };
              }
            } else {
              if (col % 2 === 0) {
                return { backgroundColor: "#e5c29f" };
              } else {
                return { backgroundColor: "#d7b899" };
              }
            }
          }
        },
        colorizeClues: (clueVal) => {
          if (Number(clueVal) === 1) {
            return { color: "blue" };
          } else if (Number(clueVal) === 2) {
            return { color: "green" };
          } else if (Number(clueVal) === 3) {
            return { color: "red" };
          } else if (Number(clueVal) === 4) {
            return { color: "darkBlue" };
          } else if (Number(clueVal) === 5) {
            return { color: "maroon" };
          } else if (Number(clueVal) === 6) {
            return { color: "lightSeaGreen" };
          } else if (Number(clueVal) === 7) {
            return { color: "black" };
          } else if (Number(clueVal) === 8) {
            return { color: "gray" };
          }
        },
      };
    },
  },
  watch: {
    difficulty: "newGame",
  },
  filters: {
    padTime(num) {
      let time = String(num);
      while (time.length < 3) {
        time = "0" + time;
      }
      return time;
    },
  },
  created() {
    this.detectMobile();
    this.newGame();
  },
};
</script>
