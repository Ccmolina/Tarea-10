// ---- Búsqueda ----
export function normalizeQuery(q: string): string {
  return q.trim().replace(/\s+/g, " ").toLowerCase();
}

export function buildGoogleBooksUrl(q: string, max = 20, startIndex = 0): string {
  const query = encodeURIComponent(normalizeQuery(q));
  return `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${max}&startIndex=${startIndex}`;
}

// ---- Ratings ----
export function averageRating(values: number[]): number {
  if (values.length === 0) return 0;
  const valid = values.filter(v => Number.isFinite(v) && v >= 0 && v <= 5);
  if (valid.length === 0) return 0;
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
}

// ---- Reglas de reseña ----
export function canUserReview(p: {
  isAuthenticated: boolean;
  alreadyReviewed: boolean;
  purchased?: boolean;
}): boolean {
  if (!p.isAuthenticated) return false;
  if (p.alreadyReviewed) return false;
  return p.purchased ?? true;
}

// ---- Paginación ----
export function nextPageStartIndex(current: number, pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize <= 0) throw new Error("pageSize must be > 0");
  return current + pageSize;
}
