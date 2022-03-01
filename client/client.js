const responseHandlers = require('./responseHandling.js');

const updateArticle = async () => {
    const article = document.querySelector('#articleTitle');

    const articleData = await fetch('/getNextArticle', {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });

    const articleJSON = await articleData.json();
    article.innerHTML = articleJSON.title;
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

const init = () => {
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
        responseHandlers.userPostAdd(addUserForm);
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

    // updateArticle();
};

window.onload = init;