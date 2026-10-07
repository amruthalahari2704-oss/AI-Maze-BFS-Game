/* =========================================================
   PROFESSIONAL 15 x 15 MAZE
   0 = Open Path
   1 = Wall

   The maze contains:
   - Multiple routes
   - Dead ends
   - Alternative paths
   - Open areas
========================================================= */

const mazeMap = [

    [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,1,0,1,1,1,0,1,0,1,0,1,0],
    [0,1,0,0,0,0,0,1,0,1,0,0,0,1,0],
    [0,1,1,1,1,1,0,1,0,1,1,1,0,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
    [1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
    [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
    [0,1,0,1,1,1,1,1,0,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,0,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
    [1,1,1,1,0,1,1,1,1,1,1,1,0,1,0],
    [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    [0,1,0,1,1,1,1,1,1,1,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0]

];

const ROWS = 15;
const COLS = 15;
const GAME_TIME = 30;


/* =========================================================
   POSITIONS
========================================================= */

const playerStart = {
    row: 0,
    col: 0
};

const aiStart = {
    row: 14,
    col: 14
};

const goal = {
    row: 14,
    col: 0
};


/* =========================================================
   GAME VARIABLES
========================================================= */

let player = {
    ...playerStart
};

let ai = {
    ...aiStart
};

let gameRunning = false;

let gameFinished = false;

let timeLeft = GAME_TIME;

let playerSteps = 0;

let aiSteps = 0;

let nodesExplored = 0;

let timerInterval = null;

let aiInterval = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const mazeElement =
    document.getElementById("maze");

const timerElement =
    document.getElementById("timer");

const playerStepsElement =
    document.getElementById("playerSteps");

const aiStepsElement =
    document.getElementById("aiSteps");

const nodesExploredElement =
    document.getElementById("nodesExplored");

const aiStatusTitle =
    document.getElementById("aiStatusTitle");

const aiStatusText =
    document.getElementById("aiStatusText");

const startBtn =
    document.getElementById("startBtn");

const restartBtn =
    document.getElementById("restartBtn");

const startOverlay =
    document.getElementById("startOverlay");

const gameOverlay =
    document.getElementById("gameOverlay");

const modalStartBtn =
    document.getElementById("modalStartBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const finalTime =
    document.getElementById("finalTime");

const finalPlayerSteps =
    document.getElementById("finalPlayerSteps");

const finalAiSteps =
    document.getElementById("finalAiSteps");


/* =========================================================
   DIRECTIONS

   Up
   Down
   Left
   Right
========================================================= */

const directions = [

    {
        row: -1,
        col: 0
    },

    {
        row: 1,
        col: 0
    },

    {
        row: 0,
        col: -1
    },

    {
        row: 0,
        col: 1
    }

];


/* =========================================================
   DRAW MAZE
========================================================= */

function drawMaze() {

    mazeElement.innerHTML = "";

    for (let row = 0; row < ROWS; row++) {

        for (let col = 0; col < COLS; col++) {

            const cell =
                document.createElement("div");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;


            /* WALL */

            if (mazeMap[row][col] === 1) {

                cell.classList.add("wall");

            }


            /* GOAL */

            if (
                row === goal.row &&
                col === goal.col
            ) {

                cell.classList.add("goal");

            }


            /* PLAYER */

            if (
                row === player.row &&
                col === player.col
            ) {

                cell.classList.add("player");

            }


            /* AI */

            if (
                row === ai.row &&
                col === ai.col
            ) {

                cell.classList.add("ai");

            }


            mazeElement.appendChild(cell);
        }
    }
}


/* =========================================================
   CHECK VALID CELL
========================================================= */

function isValidCell(row, col) {

    return (

        row >= 0 &&
        row < ROWS &&

        col >= 0 &&
        col < COLS &&

        mazeMap[row][col] === 0

    );
}


/* =========================================================
   CHECK SAME POSITION
========================================================= */

function samePosition(a, b) {

    return (

        a.row === b.row &&
        a.col === b.col

    );
}


/* =========================================================
   BFS ALGORITHM
=========================================================

   BFS searches the maze level-by-level.

   queue  -> stores cells waiting to be explored

   visited -> prevents visiting the same cell twice

   parent -> remembers where each cell came from

   At the end we reconstruct the shortest path.
========================================================= */

function bfs(start, target) {

    const queue = [];

    const visited = Array.from(
        { length: ROWS },
        () => Array(COLS).fill(false)
    );

    const parent = Array.from(
        { length: ROWS },
        () => Array(COLS).fill(null)
    );


    /* Start BFS */

    queue.push(start);

    visited[start.row][start.col] = true;


    let explored = 0;


    /* BFS LOOP */

    while (queue.length > 0) {

        const current = queue.shift();

        explored++;


        /* TARGET FOUND */

        if (
            current.row === target.row &&
            current.col === target.col
        ) {

            break;

        }


        /* EXPLORE NEIGHBOURS */

        for (const direction of directions) {

            const newRow =
                current.row + direction.row;

            const newCol =
                current.col + direction.col;


            if (
                isValidCell(newRow, newCol) &&
                !visited[newRow][newCol]
            ) {

                visited[newRow][newCol] = true;


                parent[newRow][newCol] =
                    current;


                queue.push({

                    row: newRow,
                    col: newCol

                });

            }
        }
    }


    /* =====================================================
       RECONSTRUCT PATH
    ===================================================== */

    const path = [];

    let current = target;


    while (current !== null) {

        path.unshift(current);

        current =
            parent[current.row][current.col];

    }


    /* No path found */

    if (
        path.length === 0 ||
        !samePosition(path[0], start)
    ) {

        return {

            path: [],

            explored: explored

        };

    }


    return {

        path: path,

        explored: explored

    };
}


/* =========================================================
   AI THINKING
========================================================= */

function aiThink() {

    if (!gameRunning || gameFinished) {

        return;

    }


    setAIStatus(
        "AI THINKING...",
        "BFS is searching for your position..."
    );


    /*
       Calculate BFS from AI
       to current player position.
    */

    const result =
        bfs(ai, player);


    /*
       Update explored node count.
    */

    nodesExplored += result.explored;

    nodesExploredElement.textContent =
        nodesExplored;


    return result;
}


/* =========================================================
   AI MOVE
========================================================= */

/* =========================================================
   AI MOVEMENT USING BFS
========================================================= */

function moveAI() {

    if (!gameRunning || gameFinished) {
        return;
    }

    // Find shortest path from AI to Player
    const result = bfs(ai, player);

    // Count BFS explored nodes
    nodesExplored += result.explored;
    nodesExploredElement.textContent = nodesExplored;

    // If BFS cannot find a path
    if (result.path.length < 2) {

        setAIStatus(
            "AI SEARCHING",
            "BFS is searching for a path..."
        );

        return;
    }

    // Take the NEXT cell from BFS path
    const next = result.path[1];

    // Move AI
    ai.row = next.row;
    ai.col = next.col;

    // Count AI movement
    aiSteps++;
    aiStepsElement.textContent = aiSteps;

    // Draw updated maze
    drawMaze();

    // Update AI status
    setAIStatus(
        "AI CHASING",
        "BFS found the shortest path!"
    );

    // Check if AI caught player
    if (samePosition(ai, player)) {

        endGame(
            false,
            "The AI caught you!"
        );
    }
}


/* =========================================================
   PLAYER MOVE
========================================================= */

function movePlayer(rowChange, colChange) {

    if (!gameRunning || gameFinished) {

        return;

    }


    const newRow =
        player.row + rowChange;

    const newCol =
        player.col + colChange;


    /*
       Prevent walking through walls.
    */

    if (
        !isValidCell(
            newRow,
            newCol
        )
    ) {

        return;

    }


    /*
       Move player.
    */

    player.row =
        newRow;

    player.col =
        newCol;


    playerSteps++;

    playerStepsElement.textContent =
        playerSteps;


    drawMaze();


    /*
       Check goal.
    */

    if (
        player.row === goal.row &&
        player.col === goal.col
    ) {

        endGame(
            true,
            "Amazing! You reached the goal before the AI."
        );

        return;

    }


    /*
       Check AI collision.
    */

    if (samePosition(player, ai)) {

        endGame(
            false,
            "The AI caught you!"
        );

    }
}

/* =========================================================
   PLAYER MOVEMENT FUNCTION
========================================================= */

function handlePlayerMove(direction) {

    if (!gameRunning || gameFinished) {
        return;
    }

    let rowChange = 0;
    let colChange = 0;

    switch (direction) {

        case "up":
            rowChange = -1;
            break;

        case "down":
            rowChange = 1;
            break;

        case "left":
            colChange = -1;
            break;

        case "right":
            colChange = 1;
            break;

        default:
            return;
    }

    movePlayer(rowChange, colChange);
}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", function(event) {

    let direction = null;

    switch (event.key.toLowerCase()) {

        case "arrowup":
        case "w":
            direction = "up";
            break;

        case "arrowdown":
        case "s":
            direction = "down";
            break;

        case "arrowleft":
        case "a":
            direction = "left";
            break;

        case "arrowright":
        case "d":
            direction = "right";
            break;
    }

    if (direction !== null) {

        event.preventDefault();

        handlePlayerMove(direction);
    }

});


/* =========================================================
   ON-SCREEN BUTTON CONTROLS
========================================================= */

const moveButtons =
    document.querySelectorAll(".move-btn");


moveButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const direction =
            button.dataset.move;

        handlePlayerMove(direction);

    });

});


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(timerInterval);


    timerInterval =
        setInterval(
            function () {

                if (
                    !gameRunning ||
                    gameFinished
                ) {

                    return;

                }


                timeLeft--;

                timerElement.textContent =
                    timeLeft;


                /*
                   Change timer color
                   when time is low.
                */

                if (timeLeft <= 10) {

                    timerElement.style.color =
                        "#f87171";

                }


                if (timeLeft <= 0) {

                    endGame(
                        false,
                        "Time is up! The AI wins."
                    );

                }

            },
            1000
        );
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    /*
       Reset game state.
    */

    player = {
        ...playerStart
    };

    ai = {
        ...aiStart
    };


    timeLeft =
        GAME_TIME;

    playerSteps = 0;

    aiSteps = 0;

    nodesExplored = 0;

    gameRunning = true;

    gameFinished = false;


    /*
       Reset display.
    */

    timerElement.textContent =
        timeLeft;

    timerElement.style.color =
        "#f8fafc";

    playerStepsElement.textContent =
        "0";

    aiStepsElement.textContent =
        "0";

    nodesExploredElement.textContent =
        "0";


    /*
       Hide start screen.
    */

    startOverlay.classList.add(
        "hidden"
    );

    gameOverlay.classList.add(
        "hidden"
    );


    /*
       Draw initial maze.
    */

    drawMaze();


    setAIStatus(
        "AI READY",
        "AI will use BFS to find you."
    );


    /*
       Start timer.
    */

    startTimer();


    /*
       Start AI.

       AI waits 1 second before
       making its first move.

       This gives player time
       to understand the game.
    */

    clearInterval(aiInterval);


    clearInterval(aiInterval);

aiInterval = setInterval(moveAI, 1000);
}


/* =========================================================
   END GAME
========================================================= */

function endGame(playerWon, message) {

    if (gameFinished) {

        return;

    }


    gameFinished = true;

    gameRunning = false;


    clearInterval(timerInterval);

    clearInterval(aiInterval);


    /*
       Update result screen.
    */

    finalTime.textContent =
        GAME_TIME - timeLeft;

    finalPlayerSteps.textContent =
        playerSteps;

    finalAiSteps.textContent =
        aiSteps;


    if (playerWon) {

        resultIcon.textContent =
            "🏆";

        resultTitle.textContent =
            "YOU WIN!";

        resultTitle.style.color =
            "#4ade80";

        resultMessage.textContent =
            message;

        setAIStatus(
            "PLAYER ESCAPED",
            "You reached the goal!"
        );

    } else {

        resultIcon.textContent =
            "🤖";

        resultTitle.textContent =
            "GAME OVER";

        resultTitle.style.color =
            "#f87171";

        resultMessage.textContent =
            message;

        setAIStatus(
            "AI WINS",
            message
        );
    }


    /*
       Show result overlay.
    */

    gameOverlay.classList.remove(
        "hidden"
    );
}


/* =========================================================
   AI STATUS
========================================================= */

function setAIStatus(title, text) {

    aiStatusTitle.textContent =
        title;

    aiStatusText.textContent =
        text;
}


/* =========================================================
   RESTART
========================================================= */

function restartGame() {

    startGame();

}


/* =========================================================
   BUTTON EVENTS
========================================================= */

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    startGame
);


modalStartBtn.addEventListener(
    "click",
    startGame
);


playAgainBtn.addEventListener(
    "click",
    startGame
);


/* =========================================================
   INITIAL DRAW
========================================================= */

drawMaze();

setAIStatus(
    "AI READY",
    "Press START GAME to begin"
);