import { Product } from '../models/product'
import { Cart } from '../models/cart'
import type { ExpressCB } from './types';

export const getProducts = async (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      })
    })
    .catch((error) => console.log(error));
};

export const getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => console.log(error));
};

export const getCart = (req, res, next) => {
  Cart.getCart(cart => {
    // Product.fetchAll(products => {
    //   const cartProducts = [];
    //   for (const product of products) {
    //     const cartProductDate = cart.products.find(prod => prod.id === product.id);
    //     if (cartProductDate) {
    //       cartProducts.push({ productData: product, qty: cartProductDate.qty });
    //     }
    //   }
    //   res.render('shop/cart', {
    //     pageTitle: 'Your Cart',
    //     path: '/cart',
    //     products: cartProducts,
    //   });
    // })
  });
};

export const postCart: ExpressCB = (req, res, next) => {
  const { productId } = req.body;
  // Product.findById(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
  res.redirect('/cart');
};

export const postCartDeleteProduct: ExpressCB = (req, res, next) => {
  // const { productId } = req.body;
  // Product.findById(productId, product => {
  //   Cart.deleteProduct(productId, product.price);
  //   res.redirect('/cart');
  // })
}

export const getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders',
  });
};

export const getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
};
