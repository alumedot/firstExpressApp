// @ts-ignore for some reason TS complains that it's not exported
import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';

export interface IUser {
  _id: string;
  getOrders?: any;
  createOrder?: any;
  getCart?: any;
  addToCart?: any;
}

export class User {
  private name: string;
  private email: string;
  private cart: any;
  private _id: string;

  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    try {
      db.collection('users').insertOne(this);
    } catch (e) {
      console.log(e);
    }
  }

  async addToCart(product) {
    // const cartProduct = this.cart.items.findIndex((item) => item._id === product._id);
    const updatedCart = {
      items: [{ productId: new ObjectId(product._id), quantity: 1 }]
    };

    const db = getDb();

    return await db
      .collection('users')
      .updateOne(
      { _id: new ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
  }

  static findById(userId: string) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId)});
  }
}
