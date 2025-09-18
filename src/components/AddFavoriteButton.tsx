"use client";

export function AddFavoriteButton({ bookId, className }: { bookId: string; className?: string }) {
  async function onClick() {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId }),
    });
    if (res.ok) alert("Agregado a Favoritos 💗");
    else if (res.status === 401) alert("Inicia sesión para agregar a favoritos.");
    else alert("No se pudo agregar a favoritos.");
  }

  return (
    <button onClick={onClick} className={className ?? "btn btn-rose"}>
      Agregar a Favoritos
    </button>
  );
}
