"use client";
import { useState, useTransition } from "react";

export function ReviewForm({ bookId }: { bookId: string }) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId, rating, content }),
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setError(j.error || "Error guardando la reseña");
            return;
          }
          setContent("");
          window.location.reload();
        });
      }}
      className="rounded-2xl border border-rose-100 bg-white/70 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <label className="text-sm font-medium text-rose-800">Calificación</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="input sm:max-w-[140px]"
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu reseña…"
        className="input mt-3"
        rows={3}
      />

      {error && <p className="mt-2 text-rose-700">{error}</p>}

      <div className="mt-3 flex gap-2">
        <button className="btn btn-rose" disabled={pending || content.trim().length===0}>
          {pending ? "Publicando…" : "Publicar reseña"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setContent("")}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}

