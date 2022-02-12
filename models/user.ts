import { INTEGER, STRING } from 'sequelize';
import type { Model } from 'sequelize';
import { sequelize } from '../util/database';

interface IUser {
  id: number;
  name: string;
  email: string;
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
