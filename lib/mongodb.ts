import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI as string;
if (!uri) throw new Error("Please add your Mongo URI to .env.local");

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
export {};

// let clientPromise;
if (process.env.NODE_ENV === "development") {
  // use cached connection across hot reload in dev mode 
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect()
    .then((client) => {
      console.log("✅ MongoDB connected (dev)");
      return client;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed (dev):", err);
      throw err;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // Reuse single client in production as well | reconnecting every request is wasteful
  if(!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect()
    .then((client) => {
      console.log("✅ MongoDB connected (prod)");
      return client;
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed (prod):", err);
      throw err;
    });
  }
}

export default clientPromise as Promise<MongoClient>;
