const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
canvas.width = 500;
canvas.height = 500;

const COLUMNS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

class Cell {
    constructor() {
        this.currentState = Math.floor(Math.random() * 2);
    }
}

function buildGrid() {
    return new Array(COLUMNS).fill(null) // Build empty array.
            .map(() => new Array(ROWS).fill(null) // Populate elements with arrays
                .map(() => new Cell())); // Loop through elements populate with Cells.
}

function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution); // x, y, width, height
            ctx.fillStyle = cell.currentState ? '#2b2b2b' : 'white'; // 1 or 0
            ctx.fill();
            ctx.stroke();
        }
    }
}

function nextGen(grid) {
    const currentGen = grid.map(arr => arr.map(cell => cell.currentState));

    for (let col = 0; col < currentGen.length; col++) {
        
        for (let row = 0; row < currentGen[col].length; row++) {
            const cell = currentGen[col][row];
            let numNeighbours = 0;

            for (let i = -1; i < 2; i++) { // Find neighbours.
                for (let j = -1; j < 2; j++) {

                    if (i === 0 && j === 0) { // skip if at self
                        continue;
                    }

                    const xCell = col + i;
                    const yCell = row + j;

                    if (xCell >= 0 && yCell >= 0 && xCell < COLUMNS && yCell < ROWS) {
                        const currentNeighbour = currentGen[col + i][row + j];
                        numNeighbours += currentNeighbour;
                    }
                }
            }

            // Apply rules: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
            if (cell === 1 && numNeighbours < 2) { 
                grid[col][row].currentState = 0;
            } else if (cell === 1 && numNeighbours > 3) {
                grid[col][row].currentState = 0;
            } else if (cell === 0 && numNeighbours === 3) {
                grid[col][row].currentState = 1;
            }
            // Default: Live cell with 2 or 3 neighbours lives on. 

        }
    }
    return grid;
}

function update() {
    grid = nextGen(grid);
    render(grid);
    setTimeout(() => {
        requestAnimationFrame(update)
    }, 100)
}


let grid = buildGrid();
requestAnimationFrame(update);