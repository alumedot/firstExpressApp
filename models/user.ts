import { INTEGER, STRING } from 'sequelize';
import type {
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasManyGetAssociationsMixin
} from 'sequelize';
import type { Model } from 'sequelize';
import { sequelize } from '../util/database';
import { ICartInstance } from './cart';
import { IOrderInstance } from './order';

export interface IUser {
  id: number;
  name: string;
  email: string;
  createCart?: HasOneCreateAssociationMixin<ICartInstance>;
  createOrder?: HasOneCreateAssociationMixin<IOrderInstance>;
  getCart?: HasOneGetAssociationMixin<ICartInstance>;
  getOrders?: HasManyGetAssociationsMixin<IOrderInstance>;
}

export interface IUserInstance extends Model<IUser>, IUser {}

export const User = sequelize.define<IUserInstance>('user', {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: STRING,
  email: STRING
});
