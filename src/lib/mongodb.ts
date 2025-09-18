
import mongoose from "mongoose";

function getMongoUri(): string {
  const v = process.env.MONGODB_URI;
  if (!v) throw new Error("⚠️ MONGODB_URI no está configurado");
  return v;
}
const MONGO_URI = getMongoUri();

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { var _mongoose: Cached | undefined; }
const cached: Cached = globalThis._mongoose ?? { conn: null, promise: null };
globalThis._mongoose = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGO_URI, { dbName: "books" });
  cached.conn = await cached.promise;
  return cached.conn;
}
