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

        displayController =(() => {

            return {};
        })();
        /*
        let boardSize = Number(prompt("board size x by x")); // I'm doing 3x3 but might as well learn how to automate 2d array fills.

        const player = createPlayer("placeholder", "X");
        const bot = createPlayer("random", "O");
        
        gameBoard.newBoard(boardSize);

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