const gameBoard  = (() => {
    let board = document.getElementById('root');
    const gameState = ["","","","","","","","","",];

    const updateState = function(id, value) {
        this.gameState.splice(id, 1, value);
    }  
    const clearBoard = function() {
        this.gameState = ["","","","","","","","","",];
    }

    const createGameBoard = function() {
        let grid = '';
        for (let i= 0; i < 9; i++) {
            if (this.gameState[i] === ''){
                grid += `<div id='${i}' class="inactive square">${this.gameState[i]}</div>`;
            } else {
                grid += `<div id='${i}' class="active square">${this.gameState[i]}</div>`;
            }
        }
        return board.innerHTML = grid;
    }

    return {updateState, clearBoard, createGameBoard, gameState};
})();

const Player = (name, value) => {
    let playMoves = [];
    const resetPlayer = function() {
        this.playMoves = [];
    };
    const move = function(id) {
        console.log(this.playMoves);
        return this.playMoves.push(id);
        
    }
    return {name, value, resetPlayer, move, playMoves};
}

let player1 = Player("", 'X');
let player2 = Player("", 'O');

const initiateGame = (() => {
    let startGame = document.getElementById('submit');
    let game = document.getElementById('game');
    let p1 = document.getElementById('player1Input');
    let p2 = document.getElementById('player2Input');
    let header = document.getElementById('header');
    
    const submit = function(event) {
        event.preventDefault();
        let form = document.getElementById('name-form');
        
        if(p1.value === '' || p2.value === '') {
            alert('Please fill in empty fields!');
            return;
        }
        form.style.display = 'none';
        game.hidden = false;
        player1.name = p1.value;
        player2.name = p2.value;
        header.innerHTML = `${player1.name}'s turn`;
    }
    startGame.addEventListener('click', submit);
})();


const displayController = (() => {
    let currentPlayer = player1;
    let gameStarted = false;
    let winner = null;
    let winningRow = null;
    let gameOver = false;
    let header = document.getElementById('header');

    const setPlayer = () => {
        // set player 1 first then alternate players
        if (gameStarted) {
            return currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
        } else {
            return (currentPlayer = player1, gameStarted = true);
        }
    }

    const alternatePlayer = () => {
        currentPlayer.name === player1.name ? header.innerHTML = `${player2.name}'s turn` : header.innerHTML = `${player1.name}'s turn`;
    }

    const calculateWinner = function(squares) {
        // check for winner every move made
        // check each players moves and if they match
        // one of the winning lines then they win
        const lines = [
          ["0", "1", "2"],
          ["3", "4", "5"],
          ["6", "7", "8"],
          ["0", "3", "6"],
          ["1", "4", "7"],
          ["2", "5", "8"],
          ["0", "4", "8"],
          ["2", "4", "6"],
        ];
        for(let i=0; i<lines.length; i++) {
            if (lines[i].every(elem => currentPlayer.playMoves.indexOf(elem) > -1)) {
                winner = currentPlayer;
                winningRow = lines[i];
                return true;
            }
        }
    }

    const printMove = () => {
        gameBoard.createGameBoard();
        let availableSquares = document.querySelectorAll('.inactive');
        availableSquares.forEach(square => square.addEventListener('click', function(e) {
            displayController.makeMove(e);
        }));
    };

    const makeMove = (event) => {
        if(!gameOver){
            setPlayer();

            gameBoard.updateState(event.target.id, currentPlayer.value);
            currentPlayer.move(event.target.id);
            printMove();

            if(calculateWinner()){
                // check for a winner and style accordingly
                gameOver = true;

                header.innerHTML = winner.name + " Won!";
                header.classList.add("winner-header");
                winningRow.forEach(a => document.getElementById(a).classList.add("winner"));
            }
            if(!gameOver) {alternatePlayer();}
            if(!gameOver && !gameBoard.gameState.includes('')) {
                header.innerHTML = "The Game is a Tie!";
            }

        };
    };

    const clearGame = () => {
        header.innerHTML = `${player1.name}'s turn`;
        header.classList.remove('winner-header');
        player1.resetPlayer();
        player2.resetPlayer();
        gameBoard.clearBoard();

        gameStarted = false;
        winner = null;
        winningRow = null;
        gameOver = false;

        printMove();
    };

    return { makeMove, printMove, clearGame };
})();
displayController.printMove();