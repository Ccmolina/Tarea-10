import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Review } from "@/models/Review";

describe("Reviews CRUD", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: "test" } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it("debería crear una reseña", async () => {
    const review = await Review.create({
      userId: new mongoose.Types.ObjectId(),
      bookId: "abc123",
      content: "Muy buen libro",
      rating: 5,
      upvotes: 0,
      downvotes: 0,
    });

    expect(review.bookId).toBe("abc123");
    expect(review.rating).toBe(5);
  });
});
