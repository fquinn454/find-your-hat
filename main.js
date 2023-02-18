const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal ;
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
playing = true;

/* Generates a random point in the nested array
   Used to select random starting point, end point and holes */
function randomNumber(mazeHeight, mazeWidth){
    let randomY = Math.floor(Math.random()* mazeHeight);
    let randomX = Math.floor(Math.random()* mazeWidth);
    return [randomY, randomX];
}

// Returns true - a square on the maze is a hole 
function isAHole(maze, square){
  for(let hole in maze.holes){
    if(hole[0] === square[0] && hole[1] === square[1]){
      return true;
    }
    else{
      return false;
    }
  }
}

/* Create a class Maze.
    - Uses nested arrays to represent a Maze
    - Print the maze
*/
class Maze{
    constructor(mazeHeight, mazeWidth, percentage){
        this.maze = [];
        this.holes = [];
        this.mazeHeight = mazeHeight;
        this.mazeWidth = mazeWidth;

        // Create an nested array of size mazeHeight and mazeWidth
        for(let i = 0; i < mazeHeight; i++){
            this.maze.push([]);
            for(let j=0; j < mazeWidth; j++){
                // Set all the characters in the maze to fieldCharacters initially
                this.maze[i][j] = fieldCharacter;
            }
        }

        // Use random number to select the holes in the grid.
        // The number of holes are give by the percentage
        for(let i = 0; i < Math.ceil(mazeHeight * mazeWidth * (percentage/100)); i++){
            let nextHole;
            do{
                nextHole = (randomNumber(mazeHeight, mazeWidth));
            }
            // If randomly chosen place is already a hole, choose again
            while(isAHole(this.maze, nextHole));
            this.holes.push(nextHole);
        }
        // Add the hole symbol to the maze for the previously selected holes
        for(let i = 0; i < this.holes.length; i++){
            this.maze[this.holes[i][0]][this.holes[i][1]] = hole;
        }

        // Chooses a starting point, must not be a hole
        do{
            this.startingPoint = randomNumber(mazeHeight, mazeWidth);
        }
        while(isAHole(this.maze, this.startingPoint));
        this.maze[this.startingPoint[0]][this.startingPoint[1]] = pathCharacter;
        
        // Chooses an ending point, must not be a hole or the starting point
        do{
            this.endPoint = randomNumber(mazeHeight, mazeWidth);
        }
        while(isAHole(this.maze, this.endPoint));
        this.maze[this.endPoint[0]][this.endPoint[1]] = hat;

        this.playerPosition = [this.startingPoint[0], this.startingPoint[1]];
    }

    // Prints each array in the nested array as a line in the maze
    print(){
        for(let i = 0; i < this.maze.length; i++){
          let outputString = "";
          for(let j = 0; j < this.maze[i].length; j++){
            outputString += this.maze[i][j];
          }
          console.log(outputString);
        }
    }
    

// Check if the player is still on the field
  checkValidPosition(num_y, num_x){
    if(num_y >= this.maze.length || num_x >= this.maze[0].length || num_x < 0 || num_y < 0){
      term.red("You are out of bounds. Stay in the field!");
      playing = false;
      return playing;
    }
    else{
      return true;
    }
  }

// Get the player's position up/down the board
  get playerPosition_Y(){
    return this.playerPosition[0];
  }

// Get the player's position left/right across the board
    get playerPosition_X(){
        return this.playerPosition[1];
    }

// Set the player's position up/down the board
    set playerPosition_Y(num_y){
        this.playerPosition[0] = num_y;
    }

// Set the player's position left/right across the board
    set playerPosition_X(num_x){
        this.playerPosition[1] = num_x;
    }

// When the player is on a position change the character to show visited
    set changeFieldCharacter(character){
        this.maze[this.playerPosition_Y][this.playerPosition_X] = character;
    }

  // Print the Field

  print(){
    for(let i = 0; i < this.maze.length; i++){
      let outputString = "";
      for(let j = 0; j < this.maze[i].length; j++){
        outputString += this.maze[i][j];
      }
      for(let k = 0; k < this.maze[0].length; k++){
        if(outputString.charAt(k) === hat){
          term.brightGreen(outputString.charAt(k));
        }
        else if(outputString.charAt(k) === hole){
          term.brightRed(outputString.charAt(k));
        }
        else if(outputString.charAt(k) === pathCharacter){
          term.brightYellow(outputString.charAt(k));
        }
        else{
          term.bgGray.brightCyan(outputString.charAt(k));
        }
      }
      console.log();
    }
  }

  // Move the player around the field
  movePlayerRight(){
    this.playerPosition_X = this.playerPosition_X += 1;
    if (this.checkValidPosition(this.playerPosition_Y, this.playerPosition_X)){
      this.checkPlayerStatus();
    }
  }
  movePlayerLeft(){
    this.playerPosition_X = this.playerPosition_X -= 1;
    if (this.checkValidPosition(this.playerPosition_Y, this.playerPosition_X)){
      this.checkPlayerStatus();
    }

  }
  movePlayerUp(){
    this.playerPosition_Y = this.playerPosition_Y -= 1;
    if (this.checkValidPosition(this.playerPosition_Y, this.playerPosition_X)){
      this.checkPlayerStatus();
    }
  }
  movePlayerDown(){
    this.playerPosition_Y = this.playerPosition_Y += 1;
    if (this.checkValidPosition(this.playerPosition_Y, this.playerPosition_X)){
      this.checkPlayerStatus();
    }
  }
  // Check if player win or lose
  checkPlayerStatus(){
    if (this.maze[this.playerPosition_Y][this.playerPosition_X] === hat){
        console.log("You win! Found your hat");
        playing = false;
    }
    else if (this.maze[this.playerPosition_Y][this.playerPosition_X] === hole){
        console.log("You fell in a hole!");
        playing = false;
        }

    else{
      this.changeFieldCharacter = pathCharacter;
    }   
  }
}
// Check if maze can be solved
function solveMaze(maze){
  const stack = [[maze.startingPoint[0], maze.startingPoint[1]]];
  const visited = [];
  while (stack.length > 0) {
      let current = stack.pop();
      // Check if we've reached the end point
      if (current[0] === maze.endPoint[0] && current[1] === maze.endPoint[1]) {
        return true;
      }
      visited.push(current);

      // Check all adjacent next squares
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nextX = current[0] + dx;
        const nextY = current[1] + dy;
        
        // Check if the next square is within the maze
        if (nextX < 0 || nextX >= maze.mazeWidth || nextY < 0 || nextY >= maze.mazeHeight) {
          // If not in maze terminate current execution of loop and start next iteration
          continue;
        }
        
        // Check if the next square is a hole or has already been visited
        if (maze.holes.some(([x, y]) => x === nextX && y === nextY)|| visited.some(([x, y]) => x === nextX && y === nextY)){
          // If a hole or already visited terminate current execution of loop and start next iteration
          continue;
        }
        
        // Add the next square to the stack
        stack.push([nextX, nextY]);
      }
  }
    // If we've reached this point, the maze is unsolvable
    return false;
}


function playGame(maze){
    while(playing){
      maze.print();
      let direction = prompt(term.blue("Which way? "));
        switch(direction){
            case "r" : maze.movePlayerRight();
            break;
            case "l" : maze.movePlayerLeft();
            break;
            case "u" : maze.movePlayerUp();
            break;
            case "d" : maze.movePlayerDown();
            break;
            default : term.red("Which way? Right(r), Left(l), Up(u), or Down(d)");
            console.log();
        }
    }
}

let myMaze = new Maze(4, 8, 50);
do {
  myMaze = new Maze(4, 8, 50);
}
while(!solveMaze(myMaze));

playGame(myMaze);



