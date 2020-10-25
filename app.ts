import path = require('path');

import express = require('express');
import bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

/*
 * Assignment
 * */
// app.use('/users', (req, res, next) => {
//   console.log('/users middleware');
//   res.send('<h1>Users middleware</h1>')
// });
//
// app.use('/', (req, res, next) => {
//   console.log('/ main middleware');
//   res.send('<h1>Home page</h1>');
// });

app.listen(3030);
