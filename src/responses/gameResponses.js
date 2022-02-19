const articleFunctions = require('../helperFunctions/articleFunctions.js');
const helperFunctions = require('../helperFunctions/helperFunctions.js');

// Note: These objects are stored in memory.
const articles = articleFunctions.createGameArticles();
const gameData = require('../gameData.json');

const getGameData = (req, res) => helperFunctions.respondJSON(req, res, 200, gameData);

const getGameDataMeta = (req, res) => helperFunctions.respondJSONMeta(req, res, 200);

// Function to add a user from a POST body.
const addUser = (request, response, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.name) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name is required.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // Make sure that the 'name' body is not already in use. If it is, send a 400.
  if (gameData.users[body.name]) {
    responseJSON.id = 'nameTaken';
    responseJSON.message = 'That name is already in use.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // If there is no user yet, create it and send a 201.
  gameData.users[body.name] = {};
  gameData.users[body.name].streak = 0;
  gameData.users[body.name].points = 0;
  gameData.users[body.name].guess = null;

  responseJSON.message = 'Created Successfully';
  return helperFunctions.respondJSON(request, response, 201, responseJSON);
};

const removeUser = (request, response, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field appears in the body. If not, send a 400.
  if (!body.name) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name is required.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // If the name does not exist, send a 400.
  if (!gameData.users[body.name]) {
    responseJSON.id = 'noName';
    responseJSON.message = 'That name does not exist.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // Delete the user and send a 202.
  delete gameData.users[body.name];

  responseJSON.message = 'Removed Successfully';
  return helperFunctions.respondJSON(request, response, 202, responseJSON);
};

const addGuess = (request, response, body) => {
  // Create JSON response that will be edited later.
  const responseJSON = {};

  // Make sure the 'name' field and 'isOnion' field appear in the body. If not, send a 400.
  if (!body.name || !body.isOnion) {
    responseJSON.id = 'missingParams';
    responseJSON.message = 'Name and guess is required.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // If the name does not exist, send a 400.
  if (!(body.isOnion === 'y' || body.isOnion === 'n')) {
    responseJSON.id = 'notValidGuess';
    responseJSON.message = 'The guess must be either \'y\' or \'n\'.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  // If the name does not exist, send a 400.
  if (!gameData.users[body.name]) {
    responseJSON.id = 'noName';
    responseJSON.message = 'That name does not exist.';
    return helperFunctions.respondJSON(request, response, 400, responseJSON);
  }

  gameData.users[body.name].guess = body.isOnion;

  responseJSON.message = 'Response Added';
  return helperFunctions.respondJSON(request, response, 201, responseJSON);
};

const updatePointsStreaks = (request, response) => {
  Object.keys(gameData.users).forEach((u) => {
    if (gameData.users[u].guess === gameData.currentArticle.isOnion) {
      gameData.users[u].streak++;
      gameData.users[u].points += gameData.users[u].streak;
      gameData.users[u].guess = null;
    } else {
      gameData.users[u].streak = 0;
      gameData.users[u].guess = null;
    }
  });

  gameData.roundNum++;

  return helperFunctions.respondJSON(request, response, 204);
};

const getNextArticle = (request, response) => {
  const currentArticleNum = helperFunctions.getRandomNum(articles.length);

  const currentArticle = articles[currentArticleNum];
  gameData.currentArticle = currentArticle;
  articles.splice(currentArticleNum, 1);

  return helperFunctions.respondJSON(request, response, 200, currentArticle);
};

const getNextArticleMeta = (request, response) => {
  const currentArticleNum = helperFunctions.getRandomNum(articles.length);

  gameData.currentArticle = articles[currentArticleNum];
  articles.splice(currentArticleNum, 1);

  return helperFunctions.respondJSONMeta(request, response, 200);
};

module.exports = {
  getGameData,
  getGameDataMeta,
  addUser,
  removeUser,
  addGuess,
  getNextArticle,
  getNextArticleMeta,
  updatePointsStreaks,
};
