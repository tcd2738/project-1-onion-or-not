const playerFunctions = require("./playerFunctions.js");

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

// Updates currentArticle in room and displays on front-end.
const updateArticle = async (roomID) => {
    const article = document.querySelector('#articleTitle');

    // Build your data string.
    const formData = `roomID=${roomID}`;

    // Make and wait for your fetch response.
    const response = await fetch('/displayNextArticle', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },       
        body: formData
    });

    if (response.status == 200) {
        const articleJSON = await response.json();
        article.innerHTML = articleJSON.title;
    }

    handleResponse(response, false)
}

// Called when front-end UI makes a GET or HEAD request.
const requestUpdate = async (getForm) => {
    //Grab the request info.
    const url = getForm.querySelector('#getUrlField').value;
    const method = getForm.querySelector('#methodSelect').value;

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        },
    });

    // Handle returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Called when front-end UI makes a user-related POST request.
const userPostAdd = async (addUserForm, roomID) => {
    
    // Grab the form info.
    const nameField = addUserForm.querySelector('#nameField');
    const nfValue = nameField.value;
    // Build your data string.
    const formData = `name=${nfValue}&roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/addUser', {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: formData,
    });

    // Change UI if player's name is accepted.
    if (response.status == 201) {
        playerFunctions.createPlayer(nfValue, roomID);
    }

    // Handled returned response and display on the front end.
    handleResponse(response, false);
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
    handleResponse,
    updateArticle,
    requestUpdate,
    userPostAdd,
    nextQuestion,
    sendPut
}