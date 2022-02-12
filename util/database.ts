import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  'node-complete',
  'root',
  '600230',
  { dialect: 'mysql', host: 'localhost', port: 3306 }
);

