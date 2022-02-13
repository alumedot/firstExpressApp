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

export const getCart = (req, res) => {
  console.log('(req as any).user.cart', (req as any).user.cart);
  (req as any).user.getCart()
    .then((cart) => {
      cart.getProducts()
        .then((products) => {
          res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products,
          });
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => console.log(error));
};

export const postCart: ExpressCB = async (req, res, next) => {
  const { productId } = req.body;

  const cart = await (req as any).user.getCart();
  const cartProducts = await cart.getProducts({ where: { id: productId } });
  const product = await Product.findByPk(productId);
  const currentProduct = cartProducts[0];
  let newQuantity = 1;


  if (currentProduct) {
    const oldQuantity = currentProduct.cartItem.quantity;
    newQuantity = oldQuantity + 1;
  }

  await cart.addProduct(currentProduct || product, {
    through: {
      quantity: newQuantity,
    }
  });

  res.redirect('/cart');

  // (req as any).user
  //   .getCart()
  //   .then((cart) => {
  //     return cart.gerProducts({ where: { id: productId } })
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length) {
  //       product = products[0];
  //     }
  //     let newQuantity = 1;
  //     if (product) {
  //
  //     }
  //     return Product.findByPk(productId)
  //       .then((product) => {
  //         return product
  //       })
  //       .catch((error) => console.log(error))
  //   })
  //   .catch((error) => console.log(error))

  // Product.findById(productId, (product) => {
  //   Cart.addProduct(productId, product.price);
  // });
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
