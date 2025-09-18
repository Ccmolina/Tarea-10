import { Schema, models, model, Types } from "mongoose";

const ReviewSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    bookId: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    content: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);
