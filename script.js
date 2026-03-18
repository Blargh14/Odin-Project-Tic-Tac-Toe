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
                    return true;
                } else {
                    return false;
                }
            };

            function checkWin() {
                let win = false;
                let symbol = "";

                
                board.forEach((row) => {
                    if (row.every((col) => col != "" && col == row[0])) {
                        win = "row" + (board.indexOf(row));
                    }
                }); // Lets me review array iteration, but doesn't allow shortcut return until the end of the forEach
                
                if (win) return win;
                
                for (let col = 0; col < board.length; col++) {
                    if (board[0][col] == "") continue;
                    symbol = board[0][col];
                    win = "col" + (col);
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
                    win = "diagdown";
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
                    win = "diagup";
                    for (let i = 1; i < board.length; i++) {
                        if (symbol != board[i].at(-(i+1))) {
                            win = false;
                            break;
                        }
                    };
                }

                if (win) return win;
                
                if (board.every((row) => 
                        row.every((col) => col != "")
                    )) {
                    win = "tie"
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
            overlay = document.querySelector("#overlay");
            scrollText = document.querySelector("#scroll-text-target");

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

            function placeSymbol(row, col, symbol) {
                viewBoard[row][col].textContent = symbol;
            };

            function winText(text) {
                scrollText.textContent = text;
                overlay.style.display = "flex";
            };

            function hideWinText() {
                overlay.style.display = "none";

            };

            function highlightWin(code) {
                if (code.includes("row")) {
                    rowNumber = Number(code.charAt(3));
                    viewBoard[rowNumber].map((cell) => cell.style.backgroundColor = "yellow");
                } else if (code.includes("col")) {
                    colNumber = Number(code.charAt(3));
                    for (let i = 0; i < viewBoard.length; i++) {
                        viewBoard[i][colNumber].style.backgroundColor = "yellow";
                    }
                } else if (code == "diagup") {
                    for (let i = 0; i < viewBoard.length; i++) {
                        viewBoard[i].at(-(i+1)).style.backgroundColor = "yellow";
                    }
                } else if (code == "diagdown") {
                    for (let i = 0; i < viewBoard.length; i++) {
                        viewBoard[i][i].style.backgroundColor = "yellow";
                    }
                }
            };

            return { newBoard, placeSymbol, winText, hideWinText, highlightWin };
        })();

        // A little procedural here but at this point I might need the distinction
        // pointed out to me. Because it feels like for a program to work eventually
        // the objects you're working with need an initial procedural declaration.

        const startButton = document.querySelector("#start-button");
        const playZone = document.querySelector("#container");
        const inputs = document.querySelectorAll("input");
        const playerName = document.querySelector("#player-name");
        const nameButton = document.querySelector("#name-button")
        let boardSize;
        let active = false;
        const player = createPlayer("placeholder", "X");
        const bot = createPlayer("random", "O");
        const playerScore = document.querySelector("#player-score");
        const botScore = document.querySelector("#bot-score");
        let botFirst = false;

        nameButton.addEventListener("click", (e) => {
            let newName = prompt("Enter name:");
            playerName.textContent = newName;
        });

        startButton.addEventListener("click", (e) => {
            if (inputs[0].checkValidity() && inputs[1].checkValidity()){
                e.preventDefault();
                displayController.hideWinText();
                if (inputs[1].value == "O") {
                    bot.symbol = "X";
                } else {
                    bot.symbol = "O";
                }
                player.symbol = inputs[1].value;
                boardSize = Number(inputs[0].value);
                gameBoard.newBoard(boardSize);

                playZone.textContent = "";
                playZone.style.setProperty("--cell-size", `${450 / boardSize}px`);
                playZone.style.setProperty("--cell-number", `${boardSize}`);
                displayController.newBoard(boardSize, playZone);

                if (botFirst) {
                    botOptions = gameBoard.availableMoves();
                    botPick = Math.floor(Math.random() * botOptions.length);
                    botPick = botOptions[botPick];

                    gameBoard.placeSymbol(...botPick, bot.symbol)
                    displayController.placeSymbol(...botPick, bot.symbol);
                }
                
                botFirst = !botFirst;
                active = true;
            }
        });

        playZone.addEventListener("click", (e) => {
            let state;
            if (active) {
                if (e.target.getAttribute("id") == "container") {
                    return;
                }
                let [row, col] = [...e.target.getAttribute("id")].map((el) => Number(el)); // Practicing FANCY Javascript because why not. Multiple array assignment with spread operator on string into a map function that converts to Number. Would look cleaner in 5 lines of code.
                
                if (!gameBoard.placeSymbol(row, col, player.symbol)) {
                    return;
                }
                displayController.placeSymbol(row, col, player.symbol);

                state = gameBoard.checkWin();

                if (state == "tie") {
                    displayController.winText("Tie game!");
                    active = false;

                    return;
                } else if (state) {
                    playerScore.textContent = ++player.wins;
                    displayController.highlightWin(state);
                    displayController.winText("You win!");
                    active = false;
                    return;
                }
                
                botOptions = gameBoard.availableMoves();
                botPick = Math.floor(Math.random() * botOptions.length);
                botPick = botOptions[botPick];

                gameBoard.placeSymbol(...botPick, bot.symbol)
                displayController.placeSymbol(...botPick, bot.symbol);

                state = gameBoard.checkWin();

                if (state == "tie") {
                    displayController.winText("Tie game!");
                    active = false;
                    return;
                } else if (state) {
                    botScore.textContent = ++bot.wins;
                    displayController.highlightWin(state);
                    displayController.winText("Bot Wins!");
                    active = false;
                    return;
                }
            }
        });
    };

    return { start };
})().start();