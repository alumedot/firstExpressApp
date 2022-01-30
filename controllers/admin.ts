import { ExpressCB } from './types';

import { Product } from '../models/product'

export const getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

export const postAddProduct: ExpressCB = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const product = new Product(null, title, imageUrl, description, price );
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => console.log(err))
};

export const getEditProduct: ExpressCB = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  }

  const { productId } = req.params;
  Product.findById(productId, product => {
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      product,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
    });
  });
};

export const postEditProduct: ExpressCB = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const updatedProduct = new Product(productId, title, imageUrl, description, price);
  updatedProduct.save();
  res.redirect('/admin/products');
}

export const getProducts: ExpressCB = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render('admin/products', {
  //     products,
  //     pageTitle: 'Admin Products',
  //     path: '/admin/products',
  //   });
  // });
};

export const postDeleteProduct: ExpressCB = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect('/admin/products');
}
