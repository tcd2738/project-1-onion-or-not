const responseHandlers = require('./responseHandling.js');

const init = () => {
    const getForm = document.querySelector('#getForm');
    const nameForm = document.querySelector('#nameForm');
    const guessForm = document.querySelector('#guessForm');
    const pointsStreaks = document.querySelector('#pointsStreaksUpdater');
    
    // Tell the forms to do their needed actions without redirecting.
    const getUsers = (e) => {
        e.preventDefault();
        responseHandlers.requestUpdate(getForm);
        return false;
    }
    const addUsers = (e) => {
        e.preventDefault();
        responseHandlers.userPost(nameForm);
        return false;
    }
    const addGuess = (e) => {
        e.preventDefault();
        responseHandlers.guessPost(guessForm);
        return false;
    }
    // No redirect as this is a button.
    const psEvent = (e) => {
        responseHandlers.sendPut(pointsStreaks);
        return false;
    }
    
    // Attach functions to related document elements.
    getForm.addEventListener('submit', getUsers);
    nameForm.addEventListener('submit', addUsers);
    guessForm.addEventListener('submit', addGuess);
    pointsStreaks.addEventListener('click', psEvent);
};

window.onload = init;