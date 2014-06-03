//
// Copyright (c) 2014 Oliver Merkel
// All rights reserved.
//
// @author Oliver Merkel, <Merkel(dot)Oliver(at)web(dot)de>
//

function Sliding() {
  this.board = {};
  for(var n=1; n<=Sliding.TILEAMOUNT; ++n) {
    this.board[n] = {
      x : ((n-1) % 4),
      y : Math.floor((n-1) / 4)
    };
  }
  this.gap = { x : 3, y : 3 };
}

Sliding.FROM1TO15 = 'from 1 to 15';
Sliding.SETUP = {};
Sliding.SETUP[Sliding.FROM1TO15] = 'abcdefghijklmno ';
Sliding.TILEAMOUNT = 15;

Sliding.prototype.copy = function ( setup ) {
  Sliding.board = setup;
};

Sliding.prototype.getState = function () {
  var result = {};
  for(var n=1; n<=Sliding.TILEAMOUNT; ++n) {
    result[n] = {
      x : this.board[n].x,
      y : this.board[n].y
    };
  }
  return result;
};

Sliding.prototype.getGap = function () {
  return { x : this.gap.x, y : this.gap.y };
};

Sliding.prototype.inRange = function (candidate, from, to) {
  return candidate > from && candidate < to;
}

Sliding.prototype.move = function (tileIndex) {
  var newGap = { x : this.board[tileIndex].x, y : this.board[tileIndex].y };
  var result = [ tileIndex ];
  for(var n=1; n<=Sliding.TILEAMOUNT; ++n) {
    var tile = this.board[n];
    if (
      ( tile.x == this.gap.x && (
      this.inRange( tile.y, this.board[tileIndex].y, this.gap.y ) ||
      this.inRange( tile.y, this.gap.y, this.board[tileIndex].y ) )) ||
      ( tile.y == this.gap.y && (
      this.inRange( tile.x, this.board[tileIndex].x, this.gap.x ) ||
      this.inRange( tile.x, this.gap.x, this.board[tileIndex].x ) ) ) ) {
      result[result.length] = n;
    }
  }
  for(var n=0; n<result.length; ++n) {
    var tile = this.board[result[n]];
    tile.y += tile.y < this.gap.y ? 1 : (tile.y > this.gap.y ? -1 : 0);
    tile.x += tile.x < this.gap.x ? 1 : (tile.x > this.gap.x ? -1 : 0);
  }
  this.gap = newGap;
  return result;
};
