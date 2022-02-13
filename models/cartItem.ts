import { INTEGER, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface ICartItem {
  id: number;
  quantity: number;
}

interface ICartItemInstance extends Model<ICartItem>, ICartItem {}

export const CartItem = sequelize.define<ICartItemInstance>('cartItem', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: INTEGER
})
