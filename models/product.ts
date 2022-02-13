import { INTEGER, STRING, DOUBLE, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface IProduct {
  title: string;
  id: number;
  price: number;
  imageUrl: string;
  description: string;
  userId?: number;
}

interface IProductInstance extends Model<IProduct>, IProduct {}

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
