import { INTEGER, STRING, DOUBLE, Model, HasManyHasAssociationMixin } from 'sequelize';
import { sequelize } from '../util/database';
import type { ICartItemInstance } from './cartItem';
import { IOrderItem } from './orderItem';

export interface IProduct {
  title: string;
  id: number;
  price: number;
  imageUrl: string;
  description: string;
  userId?: number;
}

export interface IProductInstance extends Model<IProduct>, IProduct {
  cartItem?: ICartItemInstance;
  orderItem?: Omit<IOrderItem, 'id'>;
}

export const Product = sequelize.define<IProductInstance>('product', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: STRING,
  price: {
    type: DOUBLE,
    allowNull: false
  },
  imageUrl: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,
    allowNull: false
  }
});
