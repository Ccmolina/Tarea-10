import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(60).optional()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const ReviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),  
  content: z.string().min(3).max(2000)
});

export const VoteSchema = z.object({
  reviewId: z.string().min(1),
  type: z.enum(["up", "down"])                   
});

export const FavoriteSchema = z.object({
  bookId: z.string().min(1)
});
