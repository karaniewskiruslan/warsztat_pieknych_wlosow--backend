import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://karaniewskiruslan_db_user:anjeBRZtuRrQP8up@services.88xcbdw.mongodb.net/?appName=Services';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  await client.connect();

  await client.db('admin').command({ ping: 1 });
  console.log('Pinged your deployment. You successfully connected to MongoDB!');
} finally {
  await client.close();
}

const db = client.db('services');

export default db;
