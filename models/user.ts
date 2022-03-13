// @ts-ignore for some reason TS complains that it's not exported
import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    requires: true
  },
  email: {
    type: String,
    requires: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        requires: true
      }
    }]
  }
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items]

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }


  this.cart = {
    items: updatedCartItems
  };

  return await this.save();
}

export const User = model('User', userSchema);

export interface IUser {
  _id: string;
  getOrders?: any;
  createOrder?: any;
  getCart?: any;
  addToCart?: any;
  deleteItemFromCart?: (string) => Promise<void>;
  addOrder?: () => Promise<void>;
}

// export class User {
//   private name: string;
//   private email: string;
//   private cart: any;
//   private _id: string;
//
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }
//
//   save() {
//     const db = getDb();
//     try {
//       db.collection('users').insertOne(this);
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   async addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       (item) => item.productId.toString() === product._id.toString()
//     );
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items]
//
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
//     }
//
//
//     const updatedCart = {
//       items: updatedCartItems
//     };
//
//     const db = getDb();
//
//     return await db
//       .collection('users')
//       .updateOne(
//       { _id: new ObjectId(this._id) },
//       { $set: { cart: updatedCart } }
//     );
//   }
//
//   async getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(({ productId }) => productId);
//     try {
//       const products = await db.collection('products')
//         .find({
//           _id: {
//             $in: productIds,
//           }
//         })
//         .toArray();
//       return products.map((product) => ({
//         ...product,
//         quantity: this.cart.items.find(
//           (item) => item.productId.toString() === product._id.toString()
//         ).quantity
//       }));
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   async deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       ({ productId: id }) => productId.toString() !== id.toString()
//     );
//
//     const db = getDb();
//
//     return await db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//
//   async addOrder() {
//     const db = getDb();
//     const items = await this.getCart();
//     const order = {
//       items,
//       user: {
//         _id: new ObjectId(this._id),
//         name: this.name
//       }
//     }
//     await db.collection('orders').insertOne(order);
//
//     const emptyCart = { items: [] };
//     this.cart = emptyCart;
//
//     return await db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: emptyCart } }
//       );
//   }
//
//   async getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
//   }
//
//   static findById(userId: string) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(userId)});
//   }
// }
