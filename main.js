class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}

const playerCountInput = document.getElementById('playerCount');

const diceCountInput = document.getElementById('diceCount');

const winningScoreInput = document.getElementById('winningScore');

const addPlayersButton = document.getElementById('addPlayersButton');

const playersContainer = document.getElementById('playersContainer');

const startGameButton = document.getElementById('startGameButton');

let pressed = false;
let prevAmount = 0;

let players = [];

addPlayersButton.addEventListener('click', () => {
    if (playerCountInput.value < 2 || playerCountInput.value > 10) {
        alert("Pelaajien määrä kuuluu olla 2-10!")
        return;
    }

    if(diceCountInput.value > 2 || diceCountInput.value < 1){
        alert("Noppien määrä täytyy olla 1 tai 2!");
        return;
    }

    if(winningScoreInput.value > 1000 || winningScoreInput.value < 10){
        alert("Voiton pisteiden määrä täytyy olla 10 ja 1000 välillä!");
        return;
    }

    if (pressed) {
        for (let i = 0; i < prevAmount; i++) {
            const existingInput = document.getElementById(`playerName${i + 1}`);
            if (existingInput) {
                existingInput.remove();
            }
        }
    }
    for (let i = 0; i < playerCountInput.value; i++) {
        const playerNameInput = document.createElement('input');
        playerNameInput.type = 'text';
        playerNameInput.placeholder = `Player ${i + 1} Name`;
        playerNameInput.classList.add('player-name-input');
        playerNameInput.id = `playerName${i + 1}`;
        playersContainer.appendChild(playerNameInput);           
    }
    prevAmount = playerCountInput.value;
    pressed = true;
    
});

startGameButton.addEventListener('click', () => {

    if(!pressed) {
        alert('Please add players first!');
        return;
    }

    for (let i = 0; i < prevAmount; i++) {
        const playerNameInput = document.getElementById(`playerName${i + 1}`);
        if (playerNameInput && playerNameInput.value.trim() !== '') {
            const player = new Player(playerNameInput.value.trim());
            players.push(player);
        }else{
            alert(`Please enter a name for Player ${i + 1}`);
            return;
        }
    }
    sessionStorage.setItem('dices', diceCountInput.value);
    sessionStorage.setItem('winningScore', winningScoreInput.value);
    sessionStorage.setItem('players', JSON.stringify(players));
    window.location.href = 'game.html';

});