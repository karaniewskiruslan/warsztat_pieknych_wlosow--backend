"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const uri = process.env.MONGO_URL || '';
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
    tlsAllowInvalidCertificates: false,
});
const initMongo = async () => {
    try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log('Connected to MongoDB Atlas');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
initMongo();
const db = client.db('Services');
exports.default = db;
