# find-your-hat
The object of the game is to get from your starting point __'*'__ to your hat **'^'** \
You lose if you fall in a hole **'0'** or go outside the maze.

# Find Your Hat Game
__Game Features__
- The maze is made up of nested arrays, to represent the rows and columns
- Maze generator(height, width, percentageHoles)
- Random Starting and End Point positions
- Random Holes positions
- Use of terminal-kit to pretify terminal output \
__Functions__ \
*Generates a random point in the nested array \
Used to select random starting point, end point and holes*
- randomNumber(mazeHeight, mazeWidth) \
*Returns if a given position is already in an array \
used to check if a randomly selected point in the nested array is already a hole*
- function positionInArray(position, array)

## Demo
![Find Your Hat Demo](mazedemo.gif)
