class PlayerDoubles{
    constructor(id){
        this.id = id;
        this.doubles = 0;
    }
}

const dice = document.createElement('img');
const dice2 = document.createElement('img');

const diceContainer = document.getElementById('diceContainer');
const gameContainer = document.getElementById('gameContainer');

const diceRollAudio = new Audio('diceroll.mp3');

const endTurnButton = document.getElementById('endTurnButton');

let players = sessionStorage.getItem('players') ? JSON.parse(sessionStorage.getItem('players')) : [];

let playerDoubles = [];

let canRoll = true;

let whoseTurn = 0;

let turnScore = 0;

let winningScore = sessionStorage.getItem('winningScore');

let gameOver = false;

const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("closeOverlay");

const toLobbyButton = document.getElementById("toLobby");

let diceCount = sessionStorage.getItem('dices');



if(diceCount == 1){

    dice.src = 'dice6.png';
    dice.id = 'diceImage';
    dice.classList.add('dice');
    diceContainer.appendChild(dice);

}else if(diceCount == 2){

    dice.src = 'dice6.png';
    dice.id = 'diceImage';
    dice.classList.add('dice');
    

    dice2.src = 'dice6.png';
    dice2.id = 'diceImage2';
    dice2.classList.add('dice');

    diceContainer.appendChild(dice);
    diceContainer.appendChild(dice2);

}

if(players !== ''){
    for (let i = 0; i < players.length; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `<h2>${players[i].name}</h2>`;
        gameContainer.appendChild(playerDiv);


        const totalScoreText = document.createElement('p');
        totalScoreText.id = `player${i}total`;
        totalScoreText.innerHTML = `Total: 0`;
        playerDiv.appendChild(totalScoreText);

        const turnScoreText = document.createElement('p');
        turnScoreText.id = `player${i}turn`;
        turnScoreText.innerHTML = `Turn: 0`;
        if(i != 0){
            turnScoreText.hidden = true;
        }
        playerDiv.appendChild(turnScoreText);

        playerDoubles[i] = new PlayerDoubles(i);
        
    }
}


closeOverlay.addEventListener("click", () => {
    overlay.hidden = true;
});

toLobbyButton.addEventListener("click", () => {
    window.location.href = "index.html";
});

dice.addEventListener('click', () => {
    roll();
});

dice2.addEventListener('click', () => {
    roll();
});



endTurnButton.addEventListener('click', () =>{
    if(gameOver) return;
    if (!canRoll) return;
    if(turnScore > 1)
    {
        addScore(turnScore, whoseTurn);

        resetTurnScore();

        changeTurn();
    }else{
        alert("Heitä noppaa ainakin kerran!");
    }

    
});

let currentPlayerText = document.getElementById(`player${whoseTurn}`);
currentPlayerText.style.color = "green";

function roll(){
    if(gameOver) return;
    if(canRoll) {
        canRoll = false;
        if(diceCount == 1)
        {
            const rolledNumber = rollDice();        
            setTimeout(() => {

                if(rolledNumber <= 1){
                    resetTurnScore();
                    
                    changeTurn();
                    
                    return;
                }
                
                addTurnScore(rolledNumber);
                checkIfWon();
            }, 750);   
        }else if(diceCount == 2){

            const rolledNumbers = rollDices(); 
            
            if(rolledNumbers == 0){
                setTimeout(() =>{
                    resetTurnScore();

                    changeTurn();
                }, 900);
            }
            
            setTimeout(() => {       
                
                addTurnScore(rolledNumbers);
                checkIfWon();

            }, 750);
        }
        
    }
}

function changeTurn(){

    document.getElementById(`player${whoseTurn}turn`).hidden = true;
    currentPlayerText.style.color = "black";

    playerDoubles[whoseTurn].doubles = 0;

    if(whoseTurn == players.length - 1){
        whoseTurn = 0;
    }else{
        whoseTurn += 1;
    }

    document.getElementById(`player${whoseTurn}turn`).hidden = false;
    currentPlayerText = document.getElementById(`player${whoseTurn}`);
    currentPlayerText.style.color = "green";
}

function resetTurnScore(){
    turnScore = 0;
    updateTurnScore();
}

function addTurnScore(score){
    turnScore += score;
    updateTurnScore()
}

function rollDice() {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    dice.style.transform = 'scale(1.5)';
    diceRollAudio.play();
    setTimeout(() => {
        dice.style.transform = 'scale(1)';
    }, 750);
    setTimeout(() => {
        dice.src = `dice${randomNumber}.png`;        
    }, 750);
    setTimeout(()=>{
        canRoll = true;
    }, 900);
    return randomNumber;
}

function rollDices(){
    const num1 = Math.floor(Math.random() * 6) + 1;
    const num2 = Math.floor(Math.random() * 6) + 1;

    let total = 0;
    
    dice.style.transform = 'scale(1.5)';
    dice2.style.transform = 'scale(1.5)';

    diceRollAudio.play();
    setTimeout(() => {
        dice.style.transform = 'scale(1)';
        dice2.style.transform = 'scale(1)';
    }, 750);
    setTimeout(() => {
        dice.src = `dice${num1}.png`;
        dice2.src = `dice${num2}.png`;
    }, 750);
    setTimeout(()=>{
        canRoll = true;
    }, 900);

    if (num1 == 1 && num2 == 1){
        total = 25;
        playerDoubles[whoseTurn].doubles += 1;
    }
    else if(num1 == num2){
        if(playerDoubles[whoseTurn].doubles == 2){            
            return 0;
        }
        total = num1 + num2;
        total = total * 2;
        playerDoubles[whoseTurn].doubles += 1;
    }
    else if (num1 == 1 || num2 == 1){
        playerDoubles[whoseTurn].doubles = 0;
        return 0;
    }
    else{
        total = num1 + num2;
        playerDoubles[whoseTurn].doubles = 0;
    }

    
    return total;
}

function updateTurnScore(){
    document.getElementById(`player${whoseTurn}turn`).innerHTML = `Turn: ${turnScore}`;

    
}

function checkIfWon(){
    if(players[whoseTurn].score + turnScore >= winningScore){
        const winnerText = document.getElementById('winnerText');
        winnerText.innerHTML = `Winner is ${players[whoseTurn].name}!`;
        overlay.hidden = false;

        gameOver = true;
    }
}

function addScore(score, player){

    players[player].score += turnScore;

    const scoreText = document.getElementById(`player${player}total`);
    scoreText.innerHTML = `Total: ${players[player].score}`;
    
}


    

