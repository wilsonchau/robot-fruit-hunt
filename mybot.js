function new_game() {
}

// Constants
var numberOfFruitWeNeed = new Array();

var myBot = {
  considerMove: function(x, y) {
     if (!myBot.isValidMove(x, y)) return false;
     if (myBot.considered[x][y] > 0) return false;
     myBot.considered[x][y] = 1;
     return true;
  },

  isValidMove: function(x, y) {
      if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT)
          return false;
      return true;
  }

};

function node(x, y, move) {
  this.x = x;
  this.y = y;
  this.move = move;
}

function isOptimalFruit(fruit) {
  if (get_opponent_item_count(fruit) >= myBot.minFruitNeeded[fruit])
    return false;
  return true;
}

function make_move() {
   myBot.board = get_board();

   // calculate some constants
   // calculate min # of each fruit we need to own it
   // go after fruit with lowest number
   myBot.minFruitNeeded = new Array(get_number_of_item_types());
   for(var i = 0; i < get_number_of_item_types(); i++) {
       myBot.minFruitNeeded[i] = Math.floor(get_total_item_count[i] / 2) + 1;
   }
   // number of types of fruits we need to capture to win
   myBot.minTypesOfFruitNeeded = Math.floor(get_number_of_item_types() / 2) + 1;

   // we found an item! take it!
   // take if it is optimal to take
   if (has_item(myBot.board[get_my_x()][get_my_y()])) {
      if (isOptimalFruit(myBot.board[get_my_x()][get_my_y()])) return TAKE;
   }

   // looks like we'll have to keep track of what moves we've looked at
   myBot.toConsider = new Array();
   myBot.considered = new Array(WIDTH);
   for (var i = 0; i < WIDTH; i++) {
       myBot.considered[i] = new Array(HEIGHT);
       for (var j = 0; j < HEIGHT; j++) {
           myBot.considered[i][j] = 0;
       }
   }

   // let's find the move that will start leading us to the closest item
   return find_move(new node(get_my_x(), get_my_y(), -1));
}

function find_move(n) {
   // closest item! we will go to it
   // try to go to items with lowest number remaining to get majority
   if (has_item(myBot.board[n.x][n.y]))
      if (isOptimalFruit(myBot.board[get_my_x()][get_my_y()])) return n.move;

   var possibleMove = n.move;

   // NORTH
   if (myBot.considerMove(n.x, n.y-1)) {
       if (n.move == -1) {
           possibleMove = NORTH;
       }
       myBot.toConsider.push(new node(n.x, n.y-1, possibleMove));
   }

   // SOUTH
   if (myBot.considerMove(n.x, n.y+1)) {
       if (n.move == -1) {
           possibleMove = SOUTH;
       }
       myBot.toConsider.push(new node(n.x, n.y+1, possibleMove));
   }

   // WEST
   if (myBot.considerMove(n.x-1, n.y)) {
       if (n.move == -1) {
           possibleMove = WEST;
       }
       myBot.toConsider.push(new node(n.x-1, n.y, possibleMove));
   }

   // EAST
   if (myBot.considerMove(n.x+1, n.y)) {
       if (n.move == -1) {
           possibleMove = EAST;
       }
       myBot.toConsider.push(new node(n.x+1, n.y, possibleMove));
   }

   // take next node to bloom out from
   if (myBot.toConsider.length > 0) {
       var next = myBot.toConsider.shift();
       return find_move(next);
   }

   // no move found
   return -1;
}
// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
