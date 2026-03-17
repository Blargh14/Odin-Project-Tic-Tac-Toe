// "Your main goal here is to have as little global code as possible."
// Could be taken as characters or lines. But how about a function that
// doesn't even get assigned to a variable?

// Self-checks: gameBoard is an object, displayController is an object,
// player is an object, create the DOM display and function last

(function runGame() {
    const start = () => {
        function createPlayer(name, symbol) {
            let wins = 0;
            return { name, symbol, wins }
        }

        const gameBoard = (() => {
            let board = [];

            function newBoard(size) {
                board = new Array(size).fill().map(
                () => Array(size).fill("")
            )};

            function placeSymbol(row, col, symbol) {
                if (!board[row][col]) { // If not ""
                    board[row][col] = symbol;
                    console.log(board); // Delete this test line
                    return true;
                } else {
                    return false;
                }
            };

            function checkWin() {
                win = false;
                let symbol = "";
                board.forEach((row) => {
                    if (row.every((col) => col != "" && col == row[0])) {
                        win = "row" + (board.indexOf(row) + 1) + " " + row[0];
                    }
                }); // Lets me review array iteration, but doesn't allow shortcut return until the end of the forEach

                if (win) return win;

                for (let col = 0; col < board.length; col++) {
                    if (board[0][col] == "") continue;
                    symbol = board[0][col];
                    win = "col" + (col + 1) + " " + symbol;
                    for (let row = 1; row < board.length; row++) {
                        if (board[row][col] != symbol) {
                            win = false;
                            break;
                        }
                    }
                    if (win) return win;
                };

                symbol = board[0][0];
                if (symbol != "") {
                    win = "diagdown " + symbol;
                    for (let i = 1; i < board.length; i++) {
                        if (symbol != board[i][i]) {
                            win = false;
                            break;
                        }
                    };
                }
                if (win) return win;

                symbol = board[0].at(-1);
                if (symbol != "") {
                    win = "diagup " + symbol;
                    for (let i = 1; i < board.length; i++) {
                        if (symbol != board[i].at(-(i+1))) {
                            win = false;
                            break;
                        }
                    };
                }

                return win;
            };

            function availableMoves() {
                moves = [];

                for (let col = 0; col < board.length; col++) {
                    for (let row = 0; row < board.length; row++) {
                        if (board[row][col] == "") {
                            moves.push([row, col]);
                        }
                    }
                };
                
                return moves;
            }

            return { newBoard, placeSymbol, checkWin, availableMoves };
        })();

        displayController = (() => {
            let viewBoard = [];

            function newBoard(size, container) {
                viewBoard = new Array(size).fill().map(
                () => Array(size).fill(""));

                for (let row = 0; row < size; row++) {
                    for (let col = 0; col < size; col++) {
                        viewBoard[row][col] = document.createElement("div");
                        viewBoard[row][col].setAttribute("class", "cell");
                        viewBoard[row][col].setAttribute("id", `${row}${col}`);
                        container.appendChild(viewBoard[row][col]);
                    }
                }
            };

            return { newBoard };
        })();

        // A little procedural here but at this point I might need the distinction
        // pointed out to me. Because it feels like for a program to work eventually
        // the objects you're working with need an initial procedural declaration.

        startButton = document.querySelector("#start-button");
        playZone = document.querySelector("#container");
        inputs = document.querySelectorAll("input");
        let boardSize;
        let botSymbol = "O";

        startButton.addEventListener("click", (e) => {
            if (inputs[0].checkValidity() && inputs[1].checkValidity()){
                e.preventDefault();
                if (inputs[1].value == "O") { botSymbol = "X" }
                boardSize = Number(inputs[0].value);
                gameBoard.newBoard(boardSize);

                playZone.textContent = "";
                playZone.style.setProperty("--cell-size", `${450 / boardSize}px`);
                playZone.style.setProperty("--cell-number", `${boardSize}`);
                displayController.newBoard(boardSize, playZone);
            }
        });

        const player = createPlayer("placeholder", inputs[1].value);
        const bot = createPlayer("random", botSymbol);
        /*

        let over = false;
        verdict = false;
        while (!over) {
            move = prompt("0-2, 0-2, no spaces").split("");
            move = move.map((el) => Number(el));
            gameBoard.placeSymbol(...move, player.symbol);
            
            verdict = gameBoard.checkWin();
            if (verdict) {
                over = true;
                break;
            }

            if (!gameBoard.availableMoves().length) {
                over = true;
                break;
            }
            
            botOptions = gameBoard.availableMoves();
            botPick = Math.floor(Math.random() * botOptions.length);
            botPick = botOptions[botPick];
            console.log(botPick);
            gameBoard.placeSymbol(...botPick, bot.symbol);

            verdict = gameBoard.checkWin();
            if (verdict) {
                over = true;
            }

            if (!gameBoard.availableMoves().length) {
                over = true;
                break;
            }
        }

        alert(verdict); */
    };

    return { start };
})().start();