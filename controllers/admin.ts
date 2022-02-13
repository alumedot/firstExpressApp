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
  (req as any).user.createProduct({
    title,
    price,
    imageUrl,
    description,
  })
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

  (req as any).user
    .getProducts({ where: { id: productId } })
    .then((products) => {
      const product = products[0];
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
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(() => {
      console.log('UPDATED PRODUCTS');
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error))
}

export const getProducts: ExpressCB = (req, res, next) => {
  (req as any).user
    .getProducts()
  // Product.findAll()
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
  const { productId } = req.body;
  Product.findByPk(productId)
    .then((product) => {
      return product.destroy()
    })
    .then(() => {
      console.log(`DESTROYED PRODUCT WITH ID - ${productId}`);
      res.redirect('/admin/products');
    })
    .catch((error) => console.log(error))
}
