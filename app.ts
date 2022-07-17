import 'dotenv/config';
import path from 'path'
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongoSession from 'connect-mongodb-session';
import csrf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';
import { router as authRoutes } from './routes/auth';
import { get404, get500 } from './controllers/error';
import { User } from './models/user';

const MongoDBStore = ConnectMongoSession(session);

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');

/*
* tell where is the dir with views
* default - views
* */
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}_${file.originalname}`);
  }
});

app.use(
  multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === 'image/png'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = (req.session as any).isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use((req, res, next) => {
  if (!(req.session as any).user) {
    return next();
  }

  User.findById((req.session as any).user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      (req as any).user = user;
      next();
    })
    .catch((e) => {
      next(new Error(e));
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', get500);

app.use(get404);

app.use((error, req, res, _next) => {
  res.status(500).render(
    '500',
    {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    }
  );
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    // example with manually setting a cerificate
    // https
    //   .createServer({ key: privateKey, cert: certificate }, app)
    //   .listen(process.env.PORT || 3030);
    app.listen(process.env.PORT || 3030);
  })
  .catch((error) => console.log(error));

module.exports = app;
