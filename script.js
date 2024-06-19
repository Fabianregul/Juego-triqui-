//CODIGO JUEGO TRIQUI CONTINUO
//AUTOR: FABIAN FERNANDO YUSTI - LICENCIADO EN EDUCACION FISICA

document.addEventListener('DOMContentLoaded', () => {
    // Variables para el estado del juego
    let currentPlayer = 'X'; // Jugador actual ('X' o 'O')
    let board = Array(9).fill(null); // Estado del tablero, inicialmente vacío
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    let gameActive = true; // Indica si el juego está activo
    let movesCount = 0; // Contador de movimientos
    let movesPerPlayer = { X: 0, O: 0 }; // Contador de movimientos por jugador
    let selectedCell = null; // Celda seleccionada para mover
    let isInitialMoves = true; // Indica si estamos en los movimientos iniciales

    // Elementos del DOM
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetButton');
    const message = document.getElementById('message');

    // Añadir evento de clic a cada celda
    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    // Reiniciar el juego
    resetButton.addEventListener('click', resetGame);

    // Manejar clic en una celda
    function handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        // Si el juego ha terminado, salir
        if (!gameActive) return;

        // Si la celda ya está ocupada por el jugador actual y estamos en fase de movimiento
        if (board[index] === currentPlayer && !isInitialMoves) {
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            selectedCell = cell;
            cell.classList.add('selected');
        } else if (board[index] === null) {
            if (isInitialMoves && movesPerPlayer[currentPlayer] < 3) {
                // Realizar los primeros tres movimientos iniciales
                board[index] = currentPlayer;
                cell.textContent = currentPlayer;
                movesPerPlayer[currentPlayer]++;
                movesCount++;
            } else if (!isInitialMoves && selectedCell) {
                // Mover la figura seleccionada a una celda vacía
                const selectedIndex = selectedCell.getAttribute('data-index');
                board[selectedIndex] = null;
                board[index] = currentPlayer;
                selectedCell.textContent = '';
                cell.textContent = currentPlayer;
                selectedCell.classList.remove('selected');
                selectedCell = null;
            } else {
                return;
            }

            // Verificar si hay un ganador
            if (checkWinner()) {
                message.textContent = `¡El jugador ${currentPlayer} ha ganado!`;
                highlightWinner();
                gameActive = false;
            } else if (movesCount >= 6) {
                // Si se han realizado los 6 movimientos iniciales, cambiar a fase de movimiento
                isInitialMoves = false;
            } else if (movesCount >= 9 && !selectedCell) {
                // Si todas las celdas están ocupadas y no hay ganador, es un empate
                message.textContent = '¡Es un empate!';
                gameActive = true; // Permitir continuar el juego en caso de empate
            }

            // Cambiar de jugador si no estamos en medio de un movimiento
            if (!selectedCell) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    // Verificar si hay un ganador
    function checkWinner() {
        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }

    // Resaltar la combinación ganadora
    function highlightWinner() {
        winPatterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                document.querySelector(`.cell[data-index='${a}']`).style.backgroundColor = 'var(--blue)';
                document.querySelector(`.cell[data-index='${b}']`).style.backgroundColor = 'var(--blue)';
                document.querySelector(`.cell[data-index='${c}']`).style.backgroundColor = 'var(--blue)';
            }
        });
    }

    // Reiniciar el juego
    function resetGame() {
        board.fill(null);
        currentPlayer = 'X';
        movesCount = 0;
        gameActive = true;
        selectedCell = null;
        isInitialMoves = true;
        movesPerPlayer = { X: 0, O: 0 };
        cells.forEach(cell => {
            cell.textContent = '';
            // cell.style.backgroundColor = '#fff';
            cell.style.background = "rgba(255, 255, 255, 0.25)";
            cell.style.backdropFilter = "blur(4px)";
            cell.style.webkitBackdropFilter = "blur(4px)"; // Nota: propiedad camelCase para webkit
            cell.style.borderRadius = "10px";
            cell.classList.remove('selected');
        });
        message.textContent = '';
    }
});
