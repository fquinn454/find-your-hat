# find-your-hat
The object of the game is to get from your starting point __'*'__ to your hat **'^'** \
You lose if you fall in a hole **'0'** or go outside the maze.

# Find Your Hat Game
## Game Features
- The maze is made up of nested arrays, to represent the rows and columns
- Maze generator(height, width, percentageHoles)
- Random Starting and End Point positions
- Random Holes positions
- Use of terminal-kit to pretify terminal output 
## Classes
The Maze class generates an array of arrays to represent the maze. \ 
The user can specify the mazeHeight and mazeWidth and the percentage of the Maze that will be filled with holes.\
The Maze will have one starting point and one ending point.\  
## Functions
__randomNumber(mazeHeight, mazeWidth)__ \
Generates a random point in the nested array. Used to select random starting point, end point and holes.\

__positionInArray(position, array)__ \
Returns if a given position is already in an array. Used to check if a randomly selected point in the nested array is already a hole.\

__checkValidPosition(num_y, num_x)__\
Checks if the player is still in the maze or has gone out of bounds.\

__moveLeft(), moveRight(), moveUp(), moveDown()__\
Functions change the this.playerPosition within the Maze Class to move around the maze\

__checkPlayerStatus()__\
Checks if the player has found their hat(won) or fallen in a hole(Lost)\

__print()__\
Uses terminal-kit to print the characters in the maze in color on the terminal\


## Demo
![Find Your Hat Demo](mazedemo.gif)
