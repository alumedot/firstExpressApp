import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';

import { router as adminRoutes } from './routes/admin';
// import { router as shopRoutes } from './routes/shop';
import { get404 } from './controllers/error';
import { User } from './models/user';
import { getMongoClient } from './util/database';

const app = express();

app.set('view engine', 'ejs');

/*
* tell where is the dir with views
* default - views
* */
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     (req as any).user = user;
  //     next();
  //   })
  //   .catch((error) => console.log(error))
})

app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(get404);

(async () => {
  const client = await getMongoClient();
  console.log('client', client);
  app.listen(3030);
})()

module.exports = app;
