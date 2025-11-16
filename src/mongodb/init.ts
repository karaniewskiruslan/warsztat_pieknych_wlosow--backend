import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://karaniewskiruslan_db_user:anjeBRZtuRrQP8up@services.88xcbdw.mongodb.net/?appName=Services';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const initMongo = async () => {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
};

initMongo();

const db = client.db('Services');

export default db;
