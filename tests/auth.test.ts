import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";

describe("Auth", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), { dbName: "test" } as any);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it("debería crear un usuario con contraseña en hash", async () => {
    const password = "secret123";
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email: "test@test.com", passwordHash: hash });
    expect(user.email).toBe("test@test.com");

    const valid = await bcrypt.compare(password, user.passwordHash);
    expect(valid).toBe(true);
  });
});
