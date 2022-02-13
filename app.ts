import path from 'path'
import express from 'express';
import bodyParser from 'body-parser';

import { router as adminRoutes } from './routes/admin';
import { router as shopRoutes } from './routes/shop';
import { get404 } from './controllers/error';
import { sequelize } from './util/database';
import { Product } from './models/product';
import { User } from './models/user';
import { Cart } from './models/cart';
import { CartItem } from './models/cartItem';
import { Order } from './models/order';
import { OrderItem } from './models/orderItem';

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

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      (req as any).user = user;
      next();
    })
    .catch((error) => console.log(error))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

// TODO delete later if sync works fine
// Product.sync().catch((err) => console.log(err));
// User.sync().catch((err) => console.log(err));

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
// It's optional, one direction is enough
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: 'Alex',
        email: 'test@test.com'
      })
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.createCart();
  })
  .then(() => {
    app.listen(3030);
  })
  .catch((error) => {
    console.log('error', error);
  })

module.exports = app;
