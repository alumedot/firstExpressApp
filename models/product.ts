import { INTEGER, STRING, DOUBLE } from 'sequelize';
import { sequelize } from '../util/database';

export const Product = sequelize.define('product', {
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
