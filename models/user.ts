import { INTEGER, STRING, HasOneCreateAssociationMixin } from 'sequelize';
import type { Model } from 'sequelize';
import { sequelize } from '../util/database';
import { ICartInstance } from './cart';

interface IUser {
  id: number;
  name: string;
  email: string;
  createCart?: HasOneCreateAssociationMixin<ICartInstance>
}

interface IUserInstance extends Model<IUser>, IUser {}

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
