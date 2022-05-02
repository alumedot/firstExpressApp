import fs from 'fs';
import path from 'path';
import { Product } from '../models/product';
import { Order } from '../models/order';
import type { ExpressCB } from './types';

export const getProducts: ExpressCB = async (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        products: products || [],
        pageTitle: 'All products',
        path: '/products'
      });
    })
    .catch(e => {
      const error = new Error(e);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    });
};

export const getProduct: ExpressCB = (req, res, next ) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch((e) => {
      const error = new Error(e);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    });
};

export const getIndex: ExpressCB = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(e => {
      const error = new Error(e);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    });
};

export const getCart: ExpressCB = async (req, res) => {
  await (req as any).user.populate('cart.items.productId');

  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart',
    products: (req as any).user.cart.items
  });
};

export const postCart: ExpressCB = async (req, res, next) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);
    await (req as any).user.addToCart(product);

    res.redirect('/cart');
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
};

export const postCartDeleteProduct: ExpressCB = async (req, res, next) => {
  const { productId } = req.body;

  try {
    await (req as any).user.removeFromCart(productId);
    res.redirect('/cart');
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}

export const postOrder: ExpressCB = async (req, res, next) => {
  await (req as any).user.populate('cart.items.productId');

  try {
    const order = new Order({
      user: {
        email: (req as any).user.email,
        userId: (req as any).user
      },
      products: (req as any).user.cart.items.map((item) => ({
        quantity: item.quantity,
        product: { ...item.productId._doc }
      }))
    });
    await order.save();
    await (req as any).user.clearCart();
    res.redirect('/orders');
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}

export const getOrders: ExpressCB = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': (req as any).user._id })

    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
};

export const getInvoice: ExpressCB = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error('No order found'));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }

    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);

    fs.readFile(invoicePath, (e, data) => {
      if (e) {
        return next();
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
      res.send(data);
    });
  } catch (e) {
    next(e);
  }
}
