var Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  var grid = [];
  for (var i = 0; i < 8; i++) {
    row = [];
    for (var j = 0; j < 8; j++) {
      row.push(' ');
    }
    grid.push(row);
  }
  grid[3][4] = new Piece ("black");
  grid[4][3] = new Piece ("black");
  grid[3][3] = new Piece ("white");
  grid[4][4] = new Piece ("white");

  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [-1, -1], [-1,  0], [-1,  1],
  [ 0, -1],           [ 0,  1],
  [ 1, -1], [ 1,  0], [ 1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  var x = pos[0]
  var y = pos[1]
  return this.grid[x][y]
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return ( this.validMoves.length > 0 );
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  var item = this.getPiece(pos)
  return (item instanceof Piece && item.color === color.toLowerCase() )
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return (this.getPiece(pos) instanceof Piece)
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return ( !( this.hasMoves("white") && this.hasMoves("black") ) );
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  var x = pos[0];
  var y = pos[1];
  return ( x >= 0 && x < 8 && y >=0 && y < 8 );
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  var x_new = pos[0] + dir[0];
  var y_new = pos[1] + dir[1];
  var new_pos = [x_new, y_new]

  if ( !board.isValidPos (pos) ) { // off the board, can't flip
    return null;

  } else if (! board.isOccupied( new_pos )) { //empty spaces can't help flip
    return null;

  } else if (! board.isMine( new_pos , color) ) { //add this opponent piece
    piecesToFlip.push (board.getPiece(new_pos) );
    return (_positionsToFlip (board, new_pos, color, dir, piecesToFlip) );

  } else if (piecesToFlip.length > 0) {
    return piecesToFlip; //hits my own piece and there are opponent pieces to flip

  } else {
    return null; //my own piece only. null.
  }
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if ( !this.validMove(pos, color )) {
    throw new Error "pos not a valid move";
  } else {
    flips = []
    for (var i = 0; i < 8; i++) {
      var dir = Board.DIRS[i]
      flips = flips.concat(_positionsToFlip(this, pos, color, dir, []) )
    }
    for (var i = 0; i < flips.length; i++) {
      flips[i].flip
    }
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  for (var i = 0; i < this.grid.length; i++) {
    return
    console.log ( this.grid[i].join("") );
  };
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (! self.isValidPos(pos) ) {
    throw new Error "pos not on board";
  } else if ( self.isOccupied(pos) ) {
    return false;
  } else {
    for (var i = 0; i < 8; i++) {
      var dir = Board.DIRS[i]
      if ( _positionsToFlip(this, pos, color, dir, []).length > 0 ) {
        return true; //if there are
      }
    }

    return false;
  }
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  var valids = []
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if ( this.validMove([[x],[y]])) { valids.push([x, y]) }
    }
  }

  return valids
};

module.exports = Board;
