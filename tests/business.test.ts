import { describe, it, expect } from "vitest";
import {
  normalizeQuery,
  buildGoogleBooksUrl,
  averageRating,
  canUserReview,
  nextPageStartIndex
} from "../src/lib/business";

describe("business logic", () => {
  // ---- normalizeQuery / buildGoogleBooksUrl ----
  it("normalizeQuery limpia espacios y lowercase", () => {
    expect(normalizeQuery("  El   PRINCIPITO  ")).toBe("el principito");
  });

  it("buildGoogleBooksUrl arma URL con parámetros correctos", () => {
    const url = buildGoogleBooksUrl("El  principito", 10, 30);
    expect(url).toContain("q=el%20principito");
    expect(url).toContain("maxResults=10");
    expect(url).toContain("startIndex=30");
  });

  // ---- averageRating ----
  it("averageRating calcula promedio a 1 decimal", () => {
    expect(averageRating([5, 4, 4])).toBe(4.3);
  });

  it("averageRating ignora valores inválidos", () => {
    expect(averageRating([5, 10, -1, NaN])).toBe(5);
  });

  it("averageRating vacío devuelve 0", () => {
    expect(averageRating([])).toBe(0);
  });

  // ---- canUserReview ----
  it("canUserReview bloquea si no autenticado", () => {
    expect(canUserReview({ isAuthenticated: false, alreadyReviewed: false })).toBe(false);
  });

  it("canUserReview bloquea si ya reseñó", () => {
    expect(canUserReview({ isAuthenticated: true, alreadyReviewed: true })).toBe(false);
  });

  it("canUserReview permite si autenticado y no reseñó", () => {
    expect(canUserReview({ isAuthenticated: true, alreadyReviewed: false })).toBe(true);
  });

  it("canUserReview bloquea si purchased=false", () => {
    expect(
      canUserReview({ isAuthenticated: true, alreadyReviewed: false, purchased: false })
    ).toBe(false);
  });

  // ---- nextPageStartIndex ----
  it("nextPageStartIndex suma pageSize al índice actual", () => {
    expect(nextPageStartIndex(20, 10)).toBe(30);
  });

  it("nextPageStartIndex lanza error si pageSize <= 0", () => {
    expect(() => nextPageStartIndex(0, 0)).toThrow();
    expect(() => nextPageStartIndex(0, -5)).toThrow();
  });
});
