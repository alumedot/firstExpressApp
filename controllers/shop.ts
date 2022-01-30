import { Product } from '../models/product'
import { Cart } from '../models/cart'
import type { ExpressCB } from './types';

export const getProducts = async (req, res, next) => {
  try {
    const [rows] = await Product.fetchAll();
    console.log('rows', rows);
    res.render('shop/product-list', {
      products: rows || [],
      pageTitle: 'All products',
      path: '/products',
    });
  } catch(e) {
    console.log(e);
  }
};

export const getProduct: ExpressCB = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    })
  });
};

export const getIndex = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('shop/index', {
  //     products,
  //     pageTitle: 'Shop',
  //     path: '/',
  //   });
  // });

  Product.fetchAll()
    .then(([rows, fieldData]) => {
      console.log('[rows, fieldData]', rows);
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
    console.log('err', err);
  });
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
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

export const postCartDeleteProduct: ExpressCB = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, product => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  })
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
