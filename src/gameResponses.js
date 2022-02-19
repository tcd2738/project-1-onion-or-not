const helperFunctions = require('./helperFunctions.js');

const gameData = {
  users: {},
  roundNum: 0,
};

const getGameData = (request, response) => helperFunctions.respondJSON(request, response, 200, gameData);

const getGameDataMeta = (request, response) => helperFunctions.respondJSONMeta(request, response, 200);

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

  responseJSON.message = 'Created Successfully';
  return helperFunctions.respondJSON(request, response, 201, responseJSON);
};

// Function to remove a user from a POST body.
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

  responseJSON.message = 'Created Successfully';
  return helperFunctions.respondJSON(request, response, 201, responseJSON);
};

const removeUser = (request, response, body) => {
    // Create JSON response that will be edited later.
    const responseJSON = {};

    // If the name does not exist, send a 400.
    if (!gameData.users[body.name]) {
      responseJSON.id = 'noName';
      responseJSON.message = 'That name does not exist.';   
      return helperFunctions.respondJSON(request, response, 400, responseJSON);
    }

    delete gameData.users[body.name];

    responseJSON.message = 'Deleted Successfully';   
    return helperFunctions.respondJSON(request, response, 200, responseJSON);
}

module.exports = {
  getGameData,
  getGameDataMeta,
  addUser,
};
