import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import { Product } from '../models/product';
import { Order } from '../models/order';
import type { ExpressCB } from './types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: null });

const ITEMS_LIMIT = 2;

export const getProducts: ExpressCB = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    const totalProducts = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEMS_LIMIT)
      .limit(ITEMS_LIMIT);

    res.render('shop/product-list', {
      products,
      pageTitle: 'All products',
      path: '/products',
      currentPage: page,
      hasNextPage: ITEMS_LIMIT * page < totalProducts,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalProducts / ITEMS_LIMIT)
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
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

export const getIndex: ExpressCB = async (req, res, next) => {
  const page = +req.query.page || 1;

  try {
    const totalProducts = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEMS_LIMIT)
      .limit(ITEMS_LIMIT);

    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/',
      currentPage: page,
      hasNextPage: ITEMS_LIMIT * page < totalProducts,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
      lastPage: Math.ceil(totalProducts / ITEMS_LIMIT)
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
};

export const getCart: ExpressCB = async (req, res, next) => {
  try {
    await (req as any).user.populate('cart.items.productId');

    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
      products: (req as any).user.cart.items
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
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

export const getCheckout: ExpressCB = async (req, res, next) => {
  try {
    await (req as any).user.populate('cart.items.productId');
    let total = 0;

    const products = (req as any).user.cart.items;

    products.forEach((product) => {
      total += product.quantity * product.productId.price;
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(({ productId, quantity }) => ({
        name: productId.title,
        description: productId.description,
        amount: productId.price * 100,
        currency: 'usd',
        quantity
      })),
      success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
    });

    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: (req as any).user.cart.items,
      totalSum: total,
      sessionId: session.id
    });
  } catch (e) {
    const error = new Error(e);
    (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
    return next(error);
  }
}

export const getCheckoutSuccess: ExpressCB = async (req, res, next) => {
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

    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text('Invoice');

    pdfDoc.text('-------------');

    let totalPrice = 0;

    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
    })

    pdfDoc.fontSize(20).text('- - -');

    pdfDoc.fontSize(14).text(`Total Price: $${totalPrice}`);

    pdfDoc.end();
  } catch (e) {
    next(e);
  }
}
