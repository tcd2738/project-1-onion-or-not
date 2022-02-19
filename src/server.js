// Required modules.
const http = require('http');
const url = require('url');
const query = require('querystring');

// Required reponse handlers.
const htmlHandler = require('./responses/htmlResponses.js');
const jsonHandler = require('./responses/jsonResponses.js');
const gameHandler = require('./responses/gameResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/bundle.js': htmlHandler.getBundle,
    '/getGameData': gameHandler.getGameData,
    '/getNextArticle': gameHandler.getNextArticle,
    notFound: jsonHandler.notFound,
  },
  PUT: {
    '/updatePointsStreaks': gameHandler.updatePointsStreaks,
  },
  HEAD: {
    '/getGameData': gameHandler.getGameDataMeta,
    '/getNextArticle': gameHandler.getNextArticleMeta,
  },
  // POST requests not included in URL struct due to different process
};

// Parse the body of the POST requests.
const parseBody = (request, response, handler) => {
  // array to hold individual pieces as they come in
  const body = [];

  // Event handler for in case of error.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Event handler for one we receive a piece of the body
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Event handler for when we finish processing the request.
  // Puts the body together.
  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    // Proceed with the provided handler function.
    handler(request, response, bodyParams);
  });
};

// Handles and directs POST requests.
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, gameHandler.addUser);
  } else if (parsedUrl.pathname === '/removeUser') {
    parseBody(request, response, gameHandler.removeUser);
  } else if (parsedUrl.pathname === '/addGuess') {
    parseBody(request, response, gameHandler.addGuess);
  }
};

// Handles any requests coming into the server and directs them to the correct place.
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  console.dir(request.method);
  console.dir(parsedUrl);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method] && urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct.GET.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
