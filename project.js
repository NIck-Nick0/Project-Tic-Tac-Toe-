// 1. Factory Function بدلاً من Constructor Function
const Player = (name, symbol) => {
  return { name, symbol };
};

// 2. السكوب الخارجي لحفظ اللاعبين
let player1 = null;
let player2 = null;

const DisplayController = (() => {
  const playerForm = document.getElementById("player-form");
  const player1Input = document.getElementById("player1-input");
  const player2Input = document.getElementById("player2-input");

  playerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name1 = player1Input.value.trim() || "Player 1";
    const name2 = player2Input.value.trim() || "Player 2";

    // 3. استدعاء الـ Factory Function مباشرة وحفظ النتيجة في المتغيرات الخارجية
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");

    console.log("Player 1:", player1); // Output: { name: '...', symbol: 'X' }
    console.log("Player 2:", player2); // Output: { name: '...', symbol: 'O' }
  });
})();


















// 2. GameBoard Module (IIFE - لإدارة مصفوفة اللوحة فقط)
const GameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setCell = (index, symbol) => {
    if (index < 0 || index >= board.length || board[index] !== "") return false;
    board[index] = symbol;
    return true;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setCell, resetBoard };
})();



// 3. GameController Module (IIFE - لإدارة منطق الدور والفوز)
const GameController = (() => {
  let activePlayerIndex = 0;
  let isGameOver = false;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const startGame = () => {
    activePlayerIndex = 0;
    isGameOver = false;
    GameBoard.resetBoard();
  };

  const getActivePlayer = () => (activePlayerIndex === 0 ? player1 : player2);

  const switchTurn = () => {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
  };

  const checkWinner = () => {
    const currentBoard = GameBoard.getBoard();
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] !== "" &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    if (!currentBoard.includes("")) return "tie";
    return null;
  };

  const playRound = (index) => {
    if (isGameOver || !player1 || !player2) return null;

    const currentPlayer = getActivePlayer();
    const success = GameBoard.setCell(index, currentPlayer.symbol);

    if (!success) return null; // المربع مشغول بالفعل

    const winner = checkWinner();
    if (winner) {
      isGameOver = true;
      return { status: "complete", winner, player: currentPlayer };
    }

    switchTurn();
    return { status: "ongoing", nextPlayer: getActivePlayer() };
  };

  return { startGame, playRound, getActivePlayer };
})();

// 4. ربط الـ DOM باللعبة وتحديث الشاشة (أضف هذا الجزء داخل DisplayController لديك أو بدله به)
const GameUI = (() => {
  const cells = document.querySelectorAll(".cell");
  const statusDisplay = document.getElementById("game-status");
  const restartBtn = document.getElementById("restart-btn");
  const playerForm = document.getElementById("player-form");

  // رسم اللوحة في الـ DOM
  const renderBoard = () => {
    const board = GameBoard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  // استجابة الـ Form عند الضغط على Start Game
  playerForm.addEventListener("submit", () => {
    GameController.startGame();
    renderBoard();
    if (statusDisplay) {
      statusDisplay.textContent = `It's ${player1.name}'s turn (${player1.symbol})`;
    }
  });

  // إضافة حداث الضغط على كل مربع من المربعات 0 إلى 8
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (!player1 || !player2) {
        if (statusDisplay) statusDisplay.textContent = "Please submit player names first!";
        return;
      }

      const result = GameController.playRound(index);
      if (!result) return;

      renderBoard();

      if (result.status === "complete") {
        if (result.winner === "tie") {
          statusDisplay.textContent = "It's a tie!";
        } else {
          statusDisplay.textContent = `${result.player.name} wins! 🎉`;
        }
      } else {
        statusDisplay.textContent = `It's ${result.nextPlayer.name}'s turn (${result.nextPlayer.symbol})`;
      }
    });
  });

  // إعادة التشغيل عند الضغط على زر Restart
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (!player1 || !player2) return;
      GameController.startGame();
      renderBoard();
      statusDisplay.textContent = `Game restarted! It's ${player1.name}'s turn (${player1.symbol})`;
    });
  }
})();














































