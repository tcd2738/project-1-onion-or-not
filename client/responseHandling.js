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
const userPost = async (nameForm) => {
    //Grab the request info.
    const url = nameForm.querySelector('#userPostUrlField').value;
    const method = nameForm.getAttribute('method');
    
    // Grab the form info.
    const nameField = nameForm.querySelector('#nameField');
    // Build your data string.
    const formData = `name=${nameField.value}`;

    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Called when front-end UI makes a guess-related POST request.
const guessPost = async (guessForm) => {
    //Grab the request info.
    const url = guessForm.getAttribute('action');
    const method = guessForm.getAttribute('method');
    
    // Grab the form info.
    const nameField = guessForm.querySelector('#nameField');
    const guessField = guessForm.querySelector('#guessField');
    // Build your data string.
    const formData = `name=${nameField.value}&isOnion=${guessField.value}`;

    // Make and wait for your fetch response.
    let response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        body: formData,
    });

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

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

modules.export = {
    requestUpdate,
    userPost,
    guessPost,
    sendPut
}