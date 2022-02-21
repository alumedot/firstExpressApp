// @ts-ignore for some reason TS complains that it's not exported
import { ObjectId } from 'mongodb';
import { getDb } from '../util/database';

export interface IUser {
  _id: string;
  getOrders?: any;
  createOrder?: any;
  getCart?: any;
}

export class User {
  private name: string;
  private email: string;

  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    try {
      db.collection('users').insertOne(this);
    } catch (e) {
      console.log(e);
    }
  }

  static findById(userId: string) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId)});
  }
}
