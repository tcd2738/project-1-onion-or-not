const got = require('got');
const Parser = require('rss-parser');
const parser = new Parser();

const articles = [];

// Loads The Onion's RSS feed and pulls headlines from it for storage in articles.
const generateOnionArticles = async () => {
  const onionArticles = await parser.parseURL('https://www.theonion.com/rss');

  const onionArticleList = onionArticles.items;
  onionArticleList.forEach((a) => {
    articles.push({
      title: a.title,
      isOnion: 'y',
    });
  });
};

// Interfaces with Reddit's Not the Onion and pulls headlines from it for storage in articles.
const generateNotOnionArticles = async () => {
  const notOnionArticles = await got('https://www.reddit.com/r/notTheOnion.json?limit=25', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const notOnionArticleList = JSON.parse(notOnionArticles.body).data.children;
  notOnionArticleList.forEach((a) => {
    articles.push({
      title: a.data.title,
      isOnion: 'n',
    });
  });
};

// Creates all game articles.
const createGameArticles = () => {
  generateOnionArticles();
  generateNotOnionArticles();

  return articles;
};

module.exports = {
  createGameArticles,
};
