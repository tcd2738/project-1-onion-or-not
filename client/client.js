const responseHandlers = require('./responseHandling.js');

let roomID;

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

const updatePointsStreaks = async () => {
    const playerPoints = document.querySelector('#playerPoints');
    const playerStreaks = document.querySelector('#playerStreak');

    // Grab the player info.
    const playerNameHolder = document.querySelector('#playerName');

    const pointsStreaksData = await fetch('/getUserData?name=' + playerNameHolder.innerHTML, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });

    const pointsStreaksJSON = await pointsStreaksData.json();
    playerPoints.innerHTML = pointsStreaksJSON.points;
    playerStreaks.innerHTML = pointsStreaksData.streak;
}

const init = async () => {
    // Create game and generate roomID for attempting anything else.
    await createGame();
    responseHandlers.updateArticle(roomID);
    
    const getForm = document.getElementById('getForm');
    const addUserForm = document.getElementById('addUserForm');
    const nextQuestionButton = document.getElementById('nextQuestion');
    
    // Tell the forms to do their needed actions without redirecting.
    const getUsers = (e) => {
        e.preventDefault();
        responseHandlers.requestUpdate(getForm);
        return false;
    }
    const addUser = (e) => {
        e.preventDefault();
        responseHandlers.userPostAdd(addUserForm, roomID);
        return false;
    }
    // No redirect as this is a button.
    const nextQuestionEvent = (e) => {
        responseHandlers.nextQuestion();
        return false;
    }
    
    // Attach functions to related document elements.
    getForm.addEventListener('submit', getUsers);
    addUserForm.addEventListener('submit', addUser);
    nextQuestionButton.addEventListener('click', nextQuestionEvent);
};

window.onload = init;