function new_game() {
   // calculate some constants
   // calculate min # of each fruit we need to own it
   myBot.minFruitNeeded = new Array(get_number_of_item_types());
   for(var i = 0; i < get_number_of_item_types(); i++) {
       myBot.minFruitNeeded[i] = Math.floor(get_total_item_count(i+1) / 2) + 1;
   }
}

// store global state in here
var myBot = {

    findMove: function(n) {
       // closest item! we will go to if it is the target
       if (has_item(myBot.board[n.x][n.y])) {
             var boardValue = myBot.board[n.x][n.y];
             if (myBot.targetItem == myBot.board[n.x][n.y]) return n.move;
       }
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
           return myBot.findMove(next);
       }

       // no move found
       return -1;
    },

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
}

// return whether or not fruit type is still useful
function isUsefulFruit(fruit) {
  if (get_opponent_item_count(fruit) >= myBot.minFruitNeeded[fruit-1])
    return false;
  return true;
}

function make_move() {
   myBot.board = get_board();

   // we found an item! take it!
   if (has_item(myBot.board[get_my_x()][get_my_y()])) {
      if (isUsefulFruit(myBot.board[get_my_x()][get_my_y()])) return TAKE;
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

   // find item with lowest number needed for majority
   var lowest = 10000; // set to arbitrary high number
   var fruitNeededLeft;
   for(var i = 0; i < get_number_of_item_types(); i++) {
       fruitNeededLeft = myBot.minFruitNeeded[i] - get_my_item_count(i+1);
       if (isUsefulFruit(i+1) && (fruitNeededLeft <= lowest) && (fruitNeededLeft >= .5)) {
          if (lowest = fruitNeededLeft) {
            // another fruit needs same amount left to own
            // find which one collectively closer and go there
            myBot.targetItem = i+1;
          }
          else {
            lower = fruitNeededLeft;
            myBot.targetItem = i+1;
          }
       }
   }

   // find our next move to get to targetItem
   return myBot.findMove(new node(get_my_x(), get_my_y(), -1));
}

function node(x, y, move) {
    this.x = x;
    this.y = y;
    this.move = move;
}

// Optionally include this function if you'd like to always reset to a
// certain board number/layout. This is useful for repeatedly testing your
// bot(s) against known positions.
//
//function default_board_number() {
//    return 123;
//}
