const gameBoard = document.getElementById('game-board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

let board = [];
let currentPlayer = 'black'; // 'black' or 'white'

const BOARD_SIZE = 8;

function initializeBoard() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    // 初始棋子位置
    board[3][3] = 'white';
    board[3][4] = 'black';
    board[4][3] = 'black';
    board[4][4] = 'white';
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);

            if (board[r][c]) {
                const piece = document.createElement('div');
                piece.classList.add('piece', board[r][c]);
                cell.appendChild(piece);
            }
            gameBoard.appendChild(cell);
        }
    }
    updateMessage();
}

function updateMessage() {
    const blackCount = countPieces('black');
    const whiteCount = countPieces('white');
    messageElement.textContent = `黑棋: ${blackCount} 白棋: ${whiteCount} - 當前玩家: ${currentPlayer === 'black' ? '黑棋' : '白棋'}`;

    if (!hasValidMoves(currentPlayer)) {
        if (!hasValidMoves(getOpponent(currentPlayer))) {
            endGame();
        } else {
            messageElement.textContent += ` (無有效步，跳過 ${currentPlayer === 'black' ? '黑棋' : '白棋'} 回合)`;
            switchPlayer();
        }
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (isValidMove(row, col, currentPlayer)) {
        placePiece(row, col, currentPlayer);
        flipPieces(row, col, currentPlayer);
        switchPlayer();
        renderBoard();
    } else {
        messageElement.textContent = '無效的移動！';
    }
}

function isValidMove(row, col, player) {
    if (board[row][col] !== null) {
        return false; // 該位置已有棋子
    }

    const opponent = getOpponent(player);
    let isValid = false;

    // 檢查八個方向
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // 跳過中心點

            let r = row + dr;
            let c = col + dc;
            let foundOpponent = false;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
                foundOpponent = true;
                r += dr;
                c += dc;
            }

            if (foundOpponent && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                isValid = true;
                break;
            }
        }
        if (isValid) break;
    }
    return isValid;
}

function placePiece(row, col, player) {
    board[row][col] = player;
}

function flipPieces(row, col, player) {
    const opponent = getOpponent(player);

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;

            let r = row + dr;
            let c = col + dc;
            let piecesToFlip = [];

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
                piecesToFlip.push({ r, c });
                r += dr;
                c += dc;
            }

            if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
                piecesToFlip.forEach(pos => {
                    board[pos.r][pos.c] = player;
                });
            }
        }
    }
}

function getOpponent(player) {
    return player === 'black' ? 'white' : 'black';
}

function switchPlayer() {
    currentPlayer = getOpponent(currentPlayer);
}

function countPieces(player) {
    let count = 0;
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === player) {
                count++;
            }
        }
    }
    return count;
}

function hasValidMoves(player) {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (isValidMove(r, c, player)) {
                return true;
            }
        }
    }
    return false;
}

function endGame() {
    const blackCount = countPieces('black');
    const whiteCount = countPieces('white');
    let winnerMessage = '';

    if (blackCount > whiteCount) {
        winnerMessage = '黑棋獲勝！';
    } else if (whiteCount > blackCount) {
        winnerMessage = '白棋獲勝！';
    } else {
        winnerMessage = '平局！';
    }
    messageElement.textContent = `遊戲結束！ ${winnerMessage} 最終分數 - 黑棋: ${blackCount} 白棋: ${whiteCount}`;
    gameBoard.removeEventListener('click', handleCellClick); // 移除點擊事件，防止繼續遊戲
}

resetButton.addEventListener('click', () => {
    initializeBoard();
    renderBoard();
    currentPlayer = 'black'; // 重置為黑棋先手
    gameBoard.addEventListener('click', handleCellClick); // 重新添加點擊事件
});

// 遊戲開始
initializeBoard();
renderBoard();