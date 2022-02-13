import { INTEGER, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface IOrderItem {
  id: number;
  quantity: number;
}

interface IOrderItemInstance extends Model<IOrderItem>, IOrderItem {}

export const OrderItem = sequelize.define<IOrderItemInstance>('orderItem', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: INTEGER
})
