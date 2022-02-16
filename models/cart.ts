import { INTEGER, Model, HasManyGetAssociationsMixin, HasManySetAssociationsMixin } from 'sequelize';
import { sequelize } from '../util/database';
import type { IProductInstance } from './product';

export interface ICart {
  id: number;
  getProducts?: HasManyGetAssociationsMixin<IProductInstance>;
  addProduct?: any; // TODO find a correct type
  setProducts?: any;
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
