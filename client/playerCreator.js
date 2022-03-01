export const createPlayerHTML = (id) => {
    return `
    <div id="${id}">
        <p id="${id}Name"></p>
        <label>Current guess:</label>
        <p id="${id}Guess"></p>
        <form id="${id}GuessForm" action="/addGuess" method="post">
            <label for="guess">Is it The Onion? ('y' or 'n'): </label>
            <input type="radio" id="onionY" name="isItOnion${id}" value="y">
            <label for="onionY">yes</label><br>
            <input type="radio" id="onionN" name="isItOnion${id}" value="n">
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