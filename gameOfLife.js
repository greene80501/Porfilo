const canvas = document.getElementById('gameOfLife');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cellSize = 5;
const columns = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);
let grid = createGrid();
const rejuvenationInterval = 100; // Number of frames before adding new cells
let frameCount = 0;
let isPaused = false; // Variable to track the paused state

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused; // Toggle paused state
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause'; // Update button text
});

// Create an initial grid with random values
function createGrid() {
    return new Array(columns).fill(null).map(() =>
        new Array(rows).fill(null).map(() => Math.random() > 0.7 ? 1 : 0) // 30% chance to start alive
    );
}

// Draw the grid with current cell states
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill background

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            if (grid[x][y]) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Update the grid based on the Game of Life rules
function updateGrid() {
    const nextGrid = grid.map(arr => arr.slice());

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            const cell = grid[x][y];
            let neighbors = 0;

            // Check all 8 neighbors, wrapping around edges
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;

                    const newX = (x + i + columns) % columns; // Wrap around horizontally
                    const newY = (y + j + rows) % rows; // Wrap around vertically

                    neighbors += grid[newX][newY];
                }
            }

            if (cell && (neighbors < 2 || neighbors > 3)) {
                nextGrid[x][y] = 0;
            } else if (!cell && neighbors === 3) {
                nextGrid[x][y] = 1;
            }
        }
    }

    grid = nextGrid;

    // Randomly rejuvenate the grid
    if (frameCount % rejuvenationInterval === 0) {
        for (let i = 0; i < 10; i++) { // Add 10 random cells periodically
            const randX = Math.floor(Math.random() * columns);
            const randY = Math.floor(Math.random() * rows);
            grid[randX][randY] = 1;
        }
    }
    frameCount++;
}

function loop() {
    if (!isPaused) { // Only update and draw if not paused
        drawGrid();
        updateGrid();
    }
    requestAnimationFrame(loop);
}

loop();
