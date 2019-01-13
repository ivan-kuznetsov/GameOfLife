const GRID_WIDTH = 1280;
const GRID_HEIGHT = 720;

const GRID_ROWS = 36;
const GRID_COLS = 64;

const GAME_SPEED = 100;

const grid = createGrid(GRID_ROWS, GRID_COLS);
const nextGrid = createGrid(GRID_ROWS, GRID_COLS);

let isPlaying = false;

const root = document.getElementById("root");
const table = createTable(GRID_ROWS, GRID_COLS);
createControls();

function play() {
    computeNextGrid();
    updateView();
}

function updateView() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = table.rows[i].cells[j];

            const isCellAlive = grid[i][j];
            cell.classList.toggle("alive", isCellAlive);
        }
    }
}

function createTable(rows, cols) {
    const table = document.createElement("table");

    table.className = "grid";

    for (let i = 0; i < rows; i++) {
        const row = document.createElement("tr");
        row.className = "row";

        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("td");

            cell.className = "cell";
            cell.width = GRID_WIDTH / cols;
            cell.height = GRID_HEIGHT / rows;

            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    table.addEventListener("click", e => {
        if (!e.target.classList.contains("cell")) {
            return;
        }

        const cell = e.target;
        const colIndex = cell.cellIndex;
        const rowIndex = cell.parentNode.rowIndex;
        const isCellAlive = grid[rowIndex][colIndex] === 1 ? true : false;

        grid[rowIndex][colIndex] = isCellAlive ? 0 : 1;

        cell.classList.toggle("alive", !isCellAlive);
    });

    root.appendChild(table);

    return table;
}

function createControls() {
    const startButton = document.createElement("button");
    startButton.className = "material-icons";
    startButton.textContent = "play_arrow";
    startButton.addEventListener("click", function() {
        if (isPlaying) {
            isPlaying = false;
            this.textContent = "play_arrow";
        } else {
            isPlaying = true;
            this.textContent = "pause";
            play();
        }
    });

    const resetButton = document.createElement("button");
    resetButton.className = "material-icons";
    resetButton.textContent = "replay";
    resetButton.addEventListener("click", function() {
        isPlaying = false;
        startButton.textContent = "play_arrow";

        resetGrid();
        updateView();
    });

    const randomizeButton = document.createElement("button");
    randomizeButton.className = "material-icons";
    randomizeButton.textContent = "transform";
    randomizeButton.addEventListener("click", function() {
        isPlaying = false;
        startButton.textContent = "play_arrow";

        randomizeGrid();
        updateView();
    });

    const container = document.createElement("div");
    container.className = "controls";

    container.append(startButton, resetButton, randomizeButton);

    root.appendChild(container);
}

function createGrid(rows, cols) {
    const grid = [];

    for (let i = 0; i < rows; i++) {
        grid[i] = [];

        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
        }
    }

    return grid;
}

function randomizeGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = Math.round(Math.random());
        }
    }

    return grid;
}

function resetGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = 0;
        }
    }

    return grid;
}

function computeNextGrid() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            applyRules(i, j);
        }
    }
}

function applyRules(row, col) {
    const isCellAlive = grid[row][col];
    const numberofNeighbors = countNeighbors(row, col);

    if (isCellAlive) {
        if (numberofNeighbors < 2) {
            //cell has to be dead
            nextGrid[row][col] = 0;
        } else if (numberofNeighbors === 2 || numberofNeighbors === 3) {
            //cell has to be alive
            nextGrid[row][col] = 1;
        } else if (numberofNeighbors > 3) {
            //cell has to be dead
            nextGrid[row][col] = 0;
        }
    } else {
        if (numberofNeighbors === 3) {
            //cell has to be alive
            nextGrid[row][col] = 1;
        }
    }
}

// function countNeighbors(row, col) {
//     let count = 0;

//     if(row-1 >= 0)
// }
