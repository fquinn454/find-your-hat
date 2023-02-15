const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
let playing = true;

class Field {
  constructor(field){
    this.field = field;
    this.playerPosition = [0,0];
  }

// random number generator for position of items in field
static randomNumber(num_Y, num_X){
  let random_Y = Math.floor(Math.random()*num_Y);
  let random_X = Math.floor(Math.random()*num_X);
  return [random_Y, random_X];
}
// generate fields of different sizes with certain percentage of holes
  static generateField(num_y, num_x, percentage){
    const field = [];
    for(let i = 0; i < num_y; i++){
      field.push([]);
      for(let j = 0; j < num_x; j++){
        field[i][j] = fieldCharacter;
      }
    }
  // add start position
  field[0][0] = pathCharacter;
  // add one hat
  const hatPosition = this.randomNumber(num_y, num_x);
  field[hatPosition[0]][hatPosition[1]] = hat;
  // add chosen % holes to field
  const fieldSize = num_y * num_x;
  for(let k = 0; k < Math.ceil(fieldSize * (percentage/100)); k++){
    let holePosition = this.randomNumber(num_y, num_x);
    if(holePosition[0] !== 0 && holePosition[1] !== 0){
      if(field[holePosition[0]][holePosition[1]] !== hat ){
        field[holePosition[0]][holePosition[1]] = hole;
      }
    }
    else{
      k--;
    }
  }
  return field;
}

// Check if the player is still on the field
  checkValidPosition(num_y, num_x){
    if(num_y >= this.field.length || num_x >= this.field[0].length || num_x < 0 || num_y < 0){
      console.log("You are out of bounds. Stay in the field!");
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
        this.field[this.playerPosition_Y][this.playerPosition_X] = character;
    }

  // Print the Field
print(){
    for(let i = 0; i < this.field.length; i++){
      let outputString = "";
      for(let j = 0; j < this.field[i].length; j++){
        outputString += this.field[i][j];
      }
      console.log(outputString);
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
    if (this.field[this.playerPosition_Y][this.playerPosition_X] === hat){
        console.log("You win! Found your hat");
        playing = false;
    }
    else if (this.field[this.playerPosition_Y][this.playerPosition_X] === hole){
        console.log("You fell in a hole!");
        playing = false;
        }

    else{
      this.changeFieldCharacter = pathCharacter;
    }   
  }
}

function playGame(field){
    while(playing){
      field.print();
      let direction = prompt("Which way? ");
        switch(direction){
            case "r" : field.movePlayerRight();
            break;
            case "l" : field.movePlayerLeft();
            break;
            case "u" : field.movePlayerUp();
            break;
            case "d" : field.movePlayerDown();
            break;
            default : console.log("Which way? Right(r), Left(l), Up(u), or Down(d)");
        }
    }
}

const myField = new Field(Field.generateField(3, 4, 40));
playGame(myField);

