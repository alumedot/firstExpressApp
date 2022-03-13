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

userSchema.methods.removeFromCart = function (productId: string) {
  const updatedCartItems = this.cart.items.filter(
    ({ productId: id }) => productId.toString() !== id.toString()
  );

  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  return this.save();
}

export const User = model('User', userSchema);

export interface IUser {
  _id: string;
  name: string;
  cart?: any;
  getOrders?: any;
  createOrder?: any;
  getCart?: any;
  addToCart?: any;
  removeFromCart?: (string) => Promise<void>;
  addOrder?: () => Promise<void>;
  populate?: any;
  clearCart?: () => Promise<void>;
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
