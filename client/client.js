const handleResponse = async (response, parseResponse) => {
    const content = document.querySelector('#content');
    
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

        // Print the object per the assignment's requirements.
        console.log(obj);
    }
};

// Called when front-end UI makes a GET or HEAD request.
const requestUpdate = async (userForm) => {
    //Grab the request info.
    const url = userForm.querySelector('#urlField').value;
    const method = userForm.querySelector('#methodSelect').value;

    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        }
    });

    // Handled returned response and display on the front end.
    handleResponse(response, method !== 'head');
};

// Called when front-end UI makes a POST request.
const sendPost = async (nameForm) => {

    //Grab the request info.
    const url = nameForm.getAttribute('action');
    const method = nameForm.getAttribute('method');
    
    // Grab the form info.
    const nameField = nameForm.querySelector('#nameField');
    const ageField = nameForm.querySelector('#ageField');

    // Build your data string.
    const formData = `name=${nameField.value}&age=${ageField.value}`;

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

const init = () => {
    const userForm = document.querySelector('#userForm');
    const nameForm = document.querySelector('#nameForm');
    
    // Tell the forms to do their needed actions without redirecting.
    const getUsers = (e) => {
        e.preventDefault();
        requestUpdate(userForm);
        return false;
    }
    const addUsers = (e) => {
        e.preventDefault();
        sendPost(nameForm);
        return false;
    }
    
    userForm.addEventListener('submit', getUsers);
    nameForm.addEventListener('submit', addUsers);
};

window.onload = init;