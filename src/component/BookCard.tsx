import React from "react";
type Props = { title: string; authors: string[]; onOpen?: () => void };

export default function BookCard({ title, authors, onOpen }: Props) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{authors.length ? authors.join(", ") : "Autor desconocido"}</p>
      <button onClick={onOpen}>Ver detalles</button>
    </article>
  );
}
