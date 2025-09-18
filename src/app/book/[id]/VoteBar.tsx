"use client";

type Props = { id: string; up: number; down: number }; 

export function VoteBar({ id, up, down }: Props) {
  const vote = async (type: "up" | "down") => {
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId: id, type }), 
    });
    if (res.ok) {
      window.location.reload(); // o router.refresh() si usas next/navigation
    } else {
      alert("No se pudo votar");
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <button className="btn btn-ghost" onClick={() => vote("up")}>
        👍 {up}
      </button>
      <button className="btn btn-ghost" onClick={() => vote("down")}>
        👎 {down}
      </button>
    </div>
  );
}
