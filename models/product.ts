import { Model } from 'sequelize';
import type { ICartItemInstance } from './cartItem';
import { IOrderItem } from './orderItem';
import { getDb } from '../util/database';

export interface IProduct {
  title: string;
  id: number;
  price: number;
  imageUrl: string;
  description: string;
  userId?: number;
}

export class Product {
  private title: string;
  private price: number;
  private description: string;
  private imageUrl: string;

  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDb();
    try {
      return await db.collection('products').insertOne(this);
    } catch (e) {
      console.log(e);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection('products').find().toArray();
    } catch (e) {
      console.log(e);
    }
  }
}

export interface IProductInstance extends Model<IProduct>, IProduct {
  cartItem?: ICartItemInstance;
  orderItem?: Omit<IOrderItem, 'id'>;
}
