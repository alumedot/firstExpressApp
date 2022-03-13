import { Product } from '../models/product';
import { Order } from '../models/order';
import type { ExpressCB } from './types';

export const getProducts: ExpressCB = async (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products: products || [],
        pageTitle: 'All products',
        path: '/products',
      });
    })
    .catch(error => console.log(error));
};

export const getProduct: ExpressCB = (req, res ) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch((error) => console.log(error));
};

export const getIndex: ExpressCB = (req, res) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => console.log(error));
};

export const getCart: ExpressCB = async (req, res) => {
  await req.user.populate('cart.items.productId');

  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    products: req.user.cart.items,
  });
};

export const postCart: ExpressCB = async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  await req.user.addToCart(product);

  res.redirect('/cart');
};

export const postCartDeleteProduct: ExpressCB = async (req, res) => {
  const { productId } = req.body;

  try {
    await req.user.removeFromCart(productId);
    res.redirect('/cart');
  } catch (e) {
    console.log(e);
  }
}

export const postOrder: ExpressCB = async (req, res) => {
  await req.user.populate('cart.items.productId');

  try {
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: req.user.cart.items.map((item) => ({
        quantity: item.quantity,
        product: { ...item.productId._doc }
      }))
    });
    await order.save();
    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
}

export const getOrders: ExpressCB = async (req, res) => {
  try {
    const orders = await req.user.getOrders();
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
    });
  } catch (e) {
    console.log(e);
  }
};
