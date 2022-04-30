import { validationResult } from 'express-validator';
import type { ExpressCB } from './types';
import { Product } from '../models/product'

export const getAddProduct = (req, res) => {
  return res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

export const postAddProduct: ExpressCB = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { title, imageUrl, price, description },
      hasError: true,
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: (req as any).user
  });

  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error));
};

export const getEditProduct: ExpressCB = (req, res ) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect('/');
  }

  const { productId } = req.params;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        res.redirect('/');
      }
      throw new Error('Errrrrror!');
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch((error) => {
      res.redirect('/500');
    })
};

export const postEditProduct: ExpressCB = async (req, res ) => {
  const { productId, title, imageUrl, description, price } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { title, imageUrl, price, description, _id: productId },
      hasError: true,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const productToUpdate = await Product.findById(productId);

  if (productToUpdate.userId.toString() !== req.user._id.toString()) {
    return res.redirect('/');
  }

  productToUpdate.title = title;
  productToUpdate.price = price;
  productToUpdate.imageUrl = imageUrl;
  productToUpdate.description = description;

  productToUpdate.save()
    .then(() => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error))
}

export const getProducts: ExpressCB = (req, res, next) => {
  Product
    .find({ userId: req.user._id })
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch((error) => console.log(error));
};

export const postDeleteProduct: ExpressCB = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log(`DELETED PRODUCT WITH ID - ${productId}`);
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error))
}
