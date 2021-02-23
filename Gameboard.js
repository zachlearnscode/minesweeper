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
          let row = Math.round(Math.random() * this.rows);
          let col = Math.round(Math.random() * this.cols);
    
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

    cell.hidden = false;

    // if (!cell.content) {
    //   return this.revealNeighbors(this.board, row, col);
    // }
  }

  // revealNeighbors(board, row, col) {
  //   let neighborCoords = this.findNeighbors(board, row, col);

  //   neighborCoords.forEach(coords => {
  //     let neighbor = this.board[coords.row][coords.col];

  //     if (neighbor.hidden && !neighbor.marked) {
  //       neighbor.hidden = false;
  //       if (!neighbor.content)
  //       this.revealNeighbors(this.board, coords.row, coords.col);
  //     }
  //   })
  // }

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

let easyBoard = new Gameboard(8, 10, 10)



console.log(easyBoard.board)