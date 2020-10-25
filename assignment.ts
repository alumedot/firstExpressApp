import express = require('express');

const app = express();

app.use('/users', (req, res, next) => {
  console.log('/users middleware');
  res.send('<h1>Users middleware</h1>')
});

app.use('/', (req, res, next) => {
  console.log('/ main middleware');
  res.send('<h1>Home page</h1>');
});

app.listen(3030);
