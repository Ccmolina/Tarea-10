"use client";
import { useState, useTransition } from "react";

export function VoteBar({ id, up, down }: { id: number; up: number; down: number }) {
  const [state, setState] = useState({ up, down });
  const [pending, start] = useTransition();

  function vote(type: "up" | "down") {
    start(async () => {
      const res = await fetch(`/api/reviews/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const j = await res.json();
        setState({ up: j.upvotes, down: j.downvotes });
      }
    });
  }

  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => vote("up")}
        disabled={pending}
        className="btn btn-ghost"
      >
        👍 <span className="ml-1">{state.up}</span>
      </button>
      <button
        onClick={() => vote("down")}
        disabled={pending}
        className="btn btn-ghost"
      >
        👎 <span className="ml-1">{state.down}</span>
      </button>
    </div>
  );
}
