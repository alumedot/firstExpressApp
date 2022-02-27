import { Product } from '../models/product';
import type { ExpressCB } from './types';

export const getProducts: ExpressCB = async (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(error => console.log(error));
};

export const getCart: ExpressCB = (req, res) => {
  req.user.getCart()
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

  const product = await Product.findById(productId);
  req.user.addToCart(product).then(res => console.log('res', res));

  // const cart = await req.user.getCart();
  // const cartProducts  = await cart.getProducts({ where: { id: productId } });
  // const product = await Product.findByPk(productId);
  // const currentProduct = cartProducts[0];
  // let newQuantity = 1;
  //
  //
  // if (currentProduct) {
  //   const oldQuantity = currentProduct.cartItem.quantity;
  //   newQuantity = oldQuantity + 1;
  // }
  //
  // await cart.addProduct(currentProduct || product, {
  //   through: {
  //     quantity: newQuantity,
  //   }
  // });

  res.redirect('/cart');
};

export const postCartDeleteProduct: ExpressCB = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts({ where: { id: productId } });
    await products[0].cartItem.destroy();
    res.redirect('/cart');
  } catch (e) {
    console.log(e);
  }
}

export const postOrder: ExpressCB = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const order = await req.user.createOrder();
    await order.addProducts(products.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    }));
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
}

export const getOrders: ExpressCB = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });
    res.render('shop/orders', {
      pageTitle: 'Your Orders',
      path: '/orders',
      orders,
    });
  } catch (e) {
    console.log(e);
  }
};
