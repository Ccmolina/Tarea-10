import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error("❌ Faltó configurar MONGODB_URI en el archivo .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
