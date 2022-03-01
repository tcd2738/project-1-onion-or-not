const playerCreator = require("./playerCreator.js");

// Handle responses on the front end.
const handleResponse = async (response, parseResponse) => {
    const content = document.querySelector('#content');
    
    // Pick HTML message to display based on response status
    switch (response.status) {
        case 200:
            content.innerHTML = `<b>Success</b>`;
            break;
        case 201:
            content.innerHTML = `<b>Created</b>`;
            break;
        case 202:
            content.innerHTML = `<b>Accepted</b>`
        case 204:
            content.innerHTML = `<b>Updated (No Content)</b>`;
            return;
        case 400:
            content.innerHTML = `<b>Bad Request</b>`;
            break;
        case 404:
            content.innerHTML = `<b>Not Found</b>`;
            break;
        default:
            content.innerHTML = `<b>Response code not implemented by client.</b>`;
            break;
    }

    if (parseResponse) {
        // Parse the response to JSON.
        let obj = await response.json();
      
        // If we have a message, display it.
        if(obj.message){
        content.innerHTML += `<p>${obj.message}</p>`;
        } else if (obj) {
        content.innerHTML += `<p>${JSON.stringify(obj)}</p>`;
        }

        console.log(obj);
    }
};

// Called when front-end UI makes a GET or HEAD request.
const requestUpdate = async (getForm) => {
    //Grab the request info.
    const url = getForm.querySelector('#getUrlField').value;
    const method = getForm.querySelector('#methodSelect').value;

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handle returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Called when front-end UI makes a user-related POST request.
const userPostAdd = async (addUserForm) => {
    //Grab the request info.
    const url = addUserForm.action;
    const method = addUserForm.method;
    
    // Grab the form info.
    const nameField = addUserForm.querySelector('#nameField');
    const nfValue = nameField.value;
    // Build your data string.
    const formData = `name=${nfValue}`;

    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    // Change UI if player's name is accepted.
    if (response.status == 201) {
        createPlayer(nfValue);
    }

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Change UI to reflect new player.
const createPlayer = (nfValue) => {
    // Reflect the new player within the UI.
    const currentUsers = document.getElementById("currentUsers");
    currentUsers.innerHTML += playerCreator.createPlayerHTML(nfValue);

    // Set up the form's created for the new player.
    const removeUserButton = document.getElementById('remove' + nfValue + 'Button');
    const guessForm = document.getElementById(nfValue + 'GuessForm');

    const removeUser = () => {
        userPostRemove(removeUserButton, nfValue);
        return false;
    }
    const addGuess = (e) => {
        e.preventDefault();
        guessPost(guessForm, nfValue);
        return false;
    }

    removeUserButton.addEventListener('click', removeUser);
    guessForm.addEventListener('submit', addGuess);

    // Add data to the new UI added for the player.
    const playerNameHolder = document.getElementById(nfValue + 'Name');
    playerNameHolder.innerHTML = nfValue;

    const playerPoints = document.getElementById(nfValue + "Points");
    playerPoints.innerHTML = 0;
    const playerStreak = document.getElementById(nfValue + "Streak");
    playerStreak.innerHTML = 0;

    const hiddenElements = document.getElementsByClassName("hide");
    for(e of hiddenElements) {
        e.classList.remove("hide");
    };
}

// Called when front-end UI makes a user-related POST request.
const userPostRemove = async (removeUserButton, nfValue) => {
    //Grab the request info.
    const url = removeUserButton.getAttribute('action');
    const method = removeUserButton.getAttribute('method');
    
    // Build your data string.
    const formData = `name=${nfValue}`;

    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (response.status == 202) {
        const user = document.getElementById(nfValue);
        user.innerHTML = "";
    }

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Called when front-end UI makes a guess-related POST request.
const guessPost = async (guessForm, nfValue) => {
    //Grab the request info.
    const url = guessForm.getAttribute('action');
    const method = guessForm.getAttribute('method');
    
    // Grab the form info.
    const guessfield = document.getElementsByName('isItOnion' + nfValue);
    let guess;
    for (let g of guessfield)
    {
        if (g.checked) {
            guess = g.value;
        }
    }
    // Build your data string.
    const formData = `name=${nfValue}&isOnion=${guess}`;

    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    if (response.status == 201) {
        const userCurrentGuess = document.getElementById(nfValue + "Guess");
        userCurrentGuess.innerHTML = guess;
    }

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Turn into one call on API end.
const nextQuestion = async () => {

    let pointsStreaksResponse = await fetch('/updatePointsStreaks', {
        method: 'put',
        headers: {
            'Accept': 'application/json'
        }
    });

    handleResponse(pointsStreaksResponse, false);

    let gameDataResponse = await fetch('/getGameData', {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    })

    const gameDataJSON = await gameDataResponse.json();
    const users = gameDataJSON.users;

    let nextArticleResponse = await fetch('/getNextArticle', {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handle returned response and display on the front end.
    handleResponse(nextArticleResponse, false);

    const article = document.querySelector('#articleTitle');
    const articleJSON = await nextArticleResponse.json();
    article.innerHTML = articleJSON.title;
}

// Called when front-end UI makes a game-related PUT request.
const sendPut = async (pointsStreaksButton) => {
    //Grab the request info.
    const url = pointsStreaksButton.getAttribute('action');
    const method = pointsStreaksButton.getAttribute('method');

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handled returned response and display on the front end.
    handleResponse(response, false);
}

module.exports = {
    requestUpdate,
    userPostAdd,
    userPostRemove,
    guessPost,
    nextQuestion,
    sendPut
}