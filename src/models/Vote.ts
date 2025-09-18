import { Schema, models, model, Types } from "mongoose";

const VoteSchema = new Schema(
  {
    reviewId: { type: Types.ObjectId, ref: "Review", required: true, index: true },
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    value: { type: Number, enum: [1, -1], required: true }
  },
  { timestamps: true }
);

VoteSchema.index({ reviewId: 1, userId: 1 }, { unique: true });

export const Vote = models.Vote || model("Vote", VoteSchema);
