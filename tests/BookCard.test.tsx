import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCard from "../src/components/BookCard";
import React from "react";



describe("BookCard", () => {
  it("muestra título y autores", () => {
    render(<BookCard title="El principito" authors={["Saint-Exupéry"]} />);
    expect(screen.getByRole("heading", { name: /el principito/i })).toBeInTheDocument();
    expect(screen.getByText(/saint-exupéry/i)).toBeInTheDocument();
  });

  it("muestra fallback si no hay autores", () => {
    render(<BookCard title="Libro X" authors={[]} />);
    expect(screen.getByText(/autor desconocido/i)).toBeInTheDocument();
  });

  it("llama onOpen al hacer click", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<BookCard title="Test" authors={[]} onOpen={onOpen} />);
    await user.click(screen.getByRole("button", { name: /ver detalles/i }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
