import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';

import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';
import { get404 } from './controllers/error';
import { sequelize } from './util/database';
import { Product } from './models/product';

// console.log('sequel', sequel);

const app = express();

app.set('view engine', 'ejs');

/*
* tell where is the dir with views
* default - views
* */
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.sync().catch((err) => console.log(err));

sequelize.sync()
  .then(result => {
    app.listen(3030);
  })
  .catch((error) => {
    console.log('error', error);
  })

module.exports = app;
