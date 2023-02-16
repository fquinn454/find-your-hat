const prompt = require('prompt-sync')({sigint: true});
const term = require( 'terminal-kit' ).terminal ;
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
playing = true;
const up = [-1, 0];
const down = [1, 0];
const right = [0, 1];
const left = [0, -1];

// Generates a random point in the nested array
// Used to select random starting point, end point and holes
function randomNumber(mazeHeight, mazeWidth){
    let randomY = Math.floor(Math.random()* mazeHeight);
    let randomX = Math.floor(Math.random()* mazeWidth);
    return [randomY, randomX];
}

// used to check if a randomly selected point in the nested array is already a hole
function positionInArray(position, array){
    for(let i = 0; i < array.length; i++){
        if(array[i][0] === position[0] && array[i][1] === position[1]){
            return true;
        }
    }
    return false;
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
            while(positionInArray(nextHole, this.holes));
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
        while(positionInArray(this.startingPoint, this.holes));
        this.maze[this.startingPoint[0]][this.startingPoint[1]] = pathCharacter;
        
        // Chooses an ending point, must not be a hole or the starting point
        do{
            this.endPoint = randomNumber(mazeHeight, mazeWidth);
        }
        while(positionInArray(this.endPoint, this.holes) || this.endPoint === this.startingPoint);
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

const myField = new Maze(4, 5, 40);
playGame(myField);

