import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongoSession from 'connect-mongodb-session';

import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';
import { router as authRoutes } from './routes/auth';
import { get404 } from './controllers/error';
import { User } from './models/user';

const MONGODB_URI = 'mongodb+srv://alumedot:VXrg9xp82OVDerum@cluster0.2fqy4.mongodb.net/shop';

const MongoDBStore = ConnectMongoSession(session);

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');

/*
* tell where is the dir with views
* default - views
* */
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use((req, res, next) => {
  User.findById('622cf70ff9500387cdc8b38b')
    .then((user) => {
      (req as any).user = user;
      next();
    })
    .catch((error) => console.log(error))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    User.findOne().then((existingUser) => {
      if (!existingUser) {
        const user = new User({
          name: 'Alex',
          email: 'alex@test.com',
          cart: { items: [] }
        })
        user.save();
      }
    })

    app.listen(3030);
  })
  .catch((error) => console.log(error));

module.exports = app;
