const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const routes = ['login', 'home', 'search', 'watch', 'channel', 'short', 'settings', 'history', 'favorites', 'subscriptions'];

routes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${route}.html`));
  });
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Nuvis running on port ${PORT}`);
});
