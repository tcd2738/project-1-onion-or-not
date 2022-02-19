const articleFunctions = require('./articleFunctions.js');
const helperFunctions = require('./helperFunctions.js');

// Note: These objects are stored in memory.
const articles = articleFunctions.createGameArticles();

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return helperFunctions.respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => helperFunctions.respondJSON(request, response, 404);

const getNextArticle = (request, response) => {
  const currentArticleNum = helperFunctions.getRandomNum(articles.length);

  const nextArticle = articles[currentArticleNum];
  articles.splice(currentArticleNum, 1);

  return helperFunctions.respondJSON(request, response, 200, nextArticle);
};

module.exports = {
  notFound,
  notFoundMeta,
  getNextArticle,
};
