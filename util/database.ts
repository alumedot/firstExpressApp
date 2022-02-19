// @ts-ignore
import { MongoClient, Db } from 'mongodb';

let _db: Db;

export const getMongoClient = async () => {
  try {
    const client = await MongoClient.connect('mongodb+srv://alumedot:VXrg9xp82OVDerum@cluster0.2fqy4.mongodb.net/shop?retryWrites=true&w=majority');
    _db = client.db();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
}
