import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';

import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';
import { get404 } from './controllers/error';

const app = express();

/*
* config for `handlebars`
* by default `views/layouts/`
* */
// app.engine('hbs', expressHbs({
//   layoutsDir: 'views/layouts/',
//   defaultLayout: 'main-layout',
//   extname: 'hbs',
// }));
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

module.exports = app;
