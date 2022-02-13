import { INTEGER, Model } from 'sequelize';
import { sequelize } from '../util/database';

export interface ICart {
  id: number;
}

export interface ICartInstance extends Model<ICart>, ICart {}

export const Cart = sequelize.define<ICartInstance>('cart', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
})
