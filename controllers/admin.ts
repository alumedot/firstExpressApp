// @ts-ignore for some reason TS complains that it's not exported
import { ObjectId } from 'mongodb';
import type { ExpressCB } from './types';
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
  const product = new Product(title, price, description, imageUrl);

  // (req as any).use r.createProduct({
  //   title,
  //   price,
  //   imageUrl,
  //   description,
  // })
  product.save()
    .then((result) => {
      console.log('result', result);
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
      res.render('admin/edit-product', {
        product,
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
      });
    })
    .catch((error) => console.log(error))
};

export const postEditProduct: ExpressCB = (req, res ) => {
  const { productId, title, imageUrl, description, price } = req.body;

  const updatedProduct = new Product(title, price, description, imageUrl, new ObjectId(productId));

  updatedProduct.save()
    .then(() => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error))
}

export const getProducts: ExpressCB = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((error) => console.log(error));
};

export const postDeleteProduct: ExpressCB = (req, res, next) => {
  // const { productId } = req.body;
  // Product.findByPk(productId)
  //   .then((product) => {
  //     return product.destroy()
  //   })
  //   .then(() => {
  //     console.log(`DESTROYED PRODUCT WITH ID - ${productId}`);
  //     res.redirect('/admin/products');
  //   })
  //   .catch((error) => console.log(error))
}
