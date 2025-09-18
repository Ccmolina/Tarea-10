"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) router.push("/");
    else setErr("Credenciales inválidas.");
  }

  return (
    <main className="mx-auto max-w-md py-10">
      <div className="card card-pad">
        <h1 className="text-2xl font-extrabold text-rose-800 mb-4">Iniciar sesión</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="input w-full"
            placeholder="email@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input w-full"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <p className="text-rose-700">{err}</p>}
          <button className="btn btn-rose w-full" disabled={loading}>
            {loading ? "Ingresando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
