const responseHandling = require('./responseHandling.js');

// HTML that is generated when a player is added to the UI.
const createPlayerHTML = (id) => {
    return `
    <div id="${id}">
        <p id="${id}Name"></p>
        <label>Current guess:</label>
        <p id="${id}Guess"></p>
        <form id="${id}GuessForm" action="/addGuess" method="post">
            <label for="guess">Is it The Onion? ('y' or 'n'): </label>
            <input type="radio" id="onionY${id}" name="isItOnion${id}" value="y">
            <label for="onionY">yes</label><br>
            <input type="radio" id="onionN${id}" name="isItOnion${id}" value="n">
            <label for="onionN">no</label><br>
            <input type="submit" value="Post Guess Method" />
        </form>
        <label>Points:</label>
        <p id="${id}Points"></p>
        <label>Current Streak:</label>
        <p id="${id}Streak"></p>
        <button id="remove${id}Button" action="/removeUser" method="post" type="button">Stop playing?</button>
    </div>
    `
}

// Called when front-end UI makes a user-related POST request.
const userPostRemove = async (nfValue, roomID) => {
    
    // Build your data string.
    const formData = `name=${nfValue}&roomID=${roomID}`;

    // Make and wait for your fetch response.
    let response = await fetch('/removeUser', {
        method: 'post',
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
    responseHandling.handleResponse(response, true);
};

// Called when front-end UI makes a guess-related POST request.
const guessPost = async (nfValue, roomID) => {
    
    // Grab the form info.
    const guessField = document.getElementsByName('isItOnion' + nfValue);
    console.log(guessField);
    let guess;
    for (let g of guessField)
    {
        if (g.checked) {
            guess = g.value;
        }
    }
    // Build your data string.
    const formData = `name=${nfValue}&isOnion=${guess}&roomID=${roomID}`;
    console.log(formData);

    // Make and wait for your fetch response.
    let response = await fetch('/addGuess', {
        method: 'post',
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
    responseHandling.handleResponse(response, true);
};

// Change UI to reflect new player.
export const createPlayer = (nfValue, roomID) => {
    // Reflect the new player within the UI.
    const currentUsers = document.getElementById("currentUsers");
    currentUsers.innerHTML += createPlayerHTML(nfValue);

    // Set up the form's created for the new player.
    const removeUserButton = document.getElementById('remove' + nfValue + 'Button');
    const guessForm = document.getElementById(nfValue + 'GuessForm');

    const removeUser = () => {
        userPostRemove(nfValue, roomID);
        return false;
    }
    const addGuess = (e) => {
        e.preventDefault();
        guessPost(nfValue, roomID);
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

    // const hiddenElements = document.getElementsByClassName("hide");
    // for(const e of hiddenElements) {
    //     e.classList.remove("hide");
    // };
}