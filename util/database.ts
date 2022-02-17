// @ts-ignore
import { MongoClient } from 'mongodb';

export const getMongoClient = async () => {
  try {
    return await MongoClient.connect('mongodb+srv://alumedot:VXrg9xp82OVDerum@cluster0.2fqy4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
  } catch (e) {
    console.log(e);
  }
}
