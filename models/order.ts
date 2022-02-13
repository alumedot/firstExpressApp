import { INTEGER, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface IOrder {
  id: number;
}

export interface IOrderInstance extends Model<IOrder>, IOrder {
  addProducts?: any; // TODO find a correct type
}

export const Order = sequelize.define<IOrderInstance>('order', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
})
