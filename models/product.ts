import { INTEGER, STRING, DOUBLE, Model, HasManyHasAssociationMixin } from 'sequelize';
import type { ICartItemInstance } from './cartItem';
import { IOrderItem } from './orderItem';
// import { getMongoClient } from '../util/database';

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

  save() {

  }
}

export interface IProductInstance extends Model<IProduct>, IProduct {
  cartItem?: ICartItemInstance;
  orderItem?: Omit<IOrderItem, 'id'>;
}

// export const Product = sequelize.define<IProductInstance>('product', {
//   id: {
//     type: INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: STRING,
//   price: {
//     type: DOUBLE,
//     allowNull: false
//   },
//   imageUrl: {
//     type: STRING,
//     allowNull: false
//   },
//   description: {
//     type: STRING,
//     allowNull: false
//   }
// });
