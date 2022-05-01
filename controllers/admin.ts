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
  const { title, price, description } = req.body;
  const image = req.file;
  const errors = validationResult(req);

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      product: { title, price, description },
      hasError: true,
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    });
  }

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { title, price, description },
      hasError: true,
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

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
    .catch((err) => {
      const error = new Error(err);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    });
};

export const getEditProduct: ExpressCB = (req, res, next ) => {
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
    .catch((err) => {
      const error = new Error(err);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    })
};

export const postEditProduct: ExpressCB = async (req, res, next ) => {
  const { productId, title, description, price } = req.body;
  const image = req.file;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      product: { title, price, description, _id: productId },
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
  productToUpdate.description = description;
  if (image) {
    productToUpdate.imageUrl = image.path;
  }

  productToUpdate.save()
    .then(() => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    })
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
    .catch((err) => {
      const error = new Error(err);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    })
};

export const postDeleteProduct: ExpressCB = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log(`DELETED PRODUCT WITH ID - ${productId}`);
      res.redirect('/admin/products');
    })
    .catch((err) => {
      const error = new Error(err);
      (error as Error & { httpStatusCode: number }).httpStatusCode = 500;
      return next(error);
    })
}
