
import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    bookId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Evitamos recompilar el modelo en hot-reload de Next.js
export const Review = models.Review || model("Review", ReviewSchema);
