// @ts-ignore for some reason TS complains that it's not exported
import { ObjectId } from 'mongodb';
import mongoose, { Schema, model } from 'mongoose';
import { getDb } from '../util/database';

const productsSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

export const Product = model('Product', productsSchema);

export interface IProduct {
  title: string;
  id: number;
  price: number;
  imageUrl: string;
  description: string;
  userId?: number;
}

// export class Product {
//   private title: string;
//   private price: number;
//   private description: string;
//   private imageUrl: string;
//   private _id: string;
//   private userId: string;
//
//   constructor(title, price, description, imageUrl, id?, userId?) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : null;
//     this.userId = userId;
//   }
//
//   async save() {
//     const db = getDb();
//
//     if (this._id) {
//       try {
//         return await db.collection('products')
//           .updateOne(
//             { _id: this._id },
//             { $set: this }
//           );
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       try {
//         console.log('create product');
//         return await db.collection('products').insertOne(this);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   }
//
//   static async fetchAll() {
//     const db = getDb();
//     try {
//       return await db.collection('products').find().toArray();
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   static async findById(prodId: string) {
//     const db = getDb();
//     try {
//       return await db.collection('products').find({_id: new ObjectId(prodId)}).next();
//     } catch (e) {
//       console.log(e);
//     }
//   }
//
//   static async deleteById(prodId: string) {
//     const db = getDb();
//     try {
//       return await db.collection('products').deleteOne({ _id: new ObjectId(prodId) });
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }
