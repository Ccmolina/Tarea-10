"use client";

type Props = { id: number; up: number; down: number };

export function VoteBar({ id, up, down }: Props) {
  const vote = async (type: "up" | "down") => {
    const res = await fetch(`/api/reviews/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) window.location.reload();
    else alert("No se pudo votar");
  };

  return (
    <div className="mt-3 flex gap-2 items-center">
      <button className="btn btn-ghost" onClick={() => vote("up")}>
        👍 {up}
      </button>
      <button className="btn btn-ghost" onClick={() => vote("down")}>
        👎 {down}
      </button>
    </div>
  );
}
