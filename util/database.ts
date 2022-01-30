import mysql from 'mysql2';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-complete',
  password: '600230',
}).promise();
