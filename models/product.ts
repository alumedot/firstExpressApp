// import fs from 'fs';
// import path from 'path';

import { db } from '../util/database';

// import { rootDir } from '../util/path'

import { Cart } from './cart'

// const p = path.join(rootDir, 'data', 'products.json');

// const getProductsFromFile = (cb?) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       return cb([]);
//     }
//     // console.log('JSON.parse(fileContent.toString())', JSON.parse(fileContent.toString()));
//     cb(JSON.parse(fileContent.toString()));
//   });
// }


export class Product {
  private id: string;
  private title: string;
  private imageUrl: string;
  private description: string;
  private price: string;

  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.imageUrl, this.description]
    );
  }

  static deleteById(id: string) {
    // getProductsFromFile(products => {
    //   const product = products.find(prod => prod.id === id);
    //   const updatedProducts = products.filter(prod => prod.id !== id);
    //   fs.writeFile(p, JSON.stringify(updatedProducts), err => {
    //     if (!err) {
    //       Cart.deleteProduct(id, product.price);
    //     }
    //   })
    // });
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id, cb?) {
    // getProductsFromFile(products => {
    //   const product = products.find(p => p.id === id);
    //   cb(product);
    // });
  }
}
