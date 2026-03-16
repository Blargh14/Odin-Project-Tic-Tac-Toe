// "Your main goal here is to have as little global code as possible."
// Could be taken as characters or lines. But how about a function that
// doesn't even get assigned to a variable?

// Self-checks: gameBoard is an object, displayController is an object,
// player is an object, create the DOM display and function last

(function runGame() {
    const start = () => {
        const gameBoard = (() => {
            let boardSize = 3; // I'm doing 3x3 but might as well learn how to automate 2d array fills.
            
            let board = [];

            function newBoard(size) {
                boardSize = size;
                board = new Array(boardSize).fill().map(
                () => Array(boardSize).fill("")
            )};

            function placeSymbol(row, col, symbol) {
                board[row][col] = symbol;
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

                for (let col = 0; col < boardSize; col++) {
                    if (board[0][col] == "") continue;
                    symbol = board[0][col];
                    win = "col" + (col + 1) + " " + symbol;
                    for (let row = 1; row < boardSize; row++) {
                        if (board[row][col] != symbol) {
                            win = false;
                            break;
                        }
                    }
                    if (win) return win;
                };

                symbol = board[0][0];
                if (symbol != "") {
                    win = "diagdown"
                    for (let i = 1; i < boardSize; i++) {
                        if (symbol != board[i][i]) {
                            win = false;
                            break;
                        }
                    };
                }
                if (win) return win;

                symbol = board[0].at(-1);
                if (symbol != "") {
                    win = "diagup"
                    for (let i = 1; i < boardSize; i++) {
                        if (symbol != board[i].at(-(i+1))) {
                            win = false;
                            break;
                        }
                    };
                }

                return win;
            };

            return { newBoard, placeSymbol, checkWin };
        })();
    };

    return { start };
})().start();