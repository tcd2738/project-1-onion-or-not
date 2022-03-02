const responseHandlers = require('./responseHandling.js');
const gameFunctions = require('./gameFunctions.js');

let roomID;

// Handles the structural changes required on the HTML page once the game begins.
beginGame = () => {
    const instructions = document.getElementById('instructions');
    const userForm = document.getElementById('addUserForm');
    const startButton = document.getElementById('startButton');

    instructions.classList.add('hide');
    userForm.classList.add('hide');
    startButton.classList.add('hide');

    const article = document.getElementById('articleTitle');
    const nextQuestion = document.getElementById('nextQuestion');

    nextQuestion.classList.remove('hide');
    article.classList.remove('hide');

    const round = document.getElementById('roundNum');
    round.innerHTML = 1;
}

// Generate room ID for new game.
const createGame = async () => {
    // Make and wait for your fetch response.
    let response = await fetch('/createRoom', {
        method: 'post',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Save the room ID if created.
    if (response.status == 201) {
        const roomCreationJSON = await response.json();
        roomID = roomCreationJSON.roomID;
    }

    // Handled returned response and display on the front end.
    responseHandlers.handleResponse(response, false);
}

const init = async () => {

    // Create game and generate roomID for attempting anything else.
    await createGame();
    gameFunctions.updateArticle(roomID);

    const startGameButton = document.getElementById('startButton');
    const addUserForm = document.getElementById('addUserForm');
    const nextQuestionButton = document.getElementById('nextQuestion');
    
    // Tell the forms to do their needed actions without redirecting.
    const startGame = (e) => {
        beginGame();
        return false;
    }
    const addUser = (e) => {
        e.preventDefault();
        gameFunctions.userPostAdd(addUserForm, roomID);
        return false;
    }
    // No redirect as this is a button.
    const nextQuestionEvent = (e) => {
        gameFunctions.nextQuestion(roomID);
        return false;
    }
    
    // Attach functions to related document elements.
    startGameButton.addEventListener('click', startGame);
    addUserForm.addEventListener('submit', addUser);
    nextQuestionButton.addEventListener('click', nextQuestionEvent);
};

window.onload = init;