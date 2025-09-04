// src/app/api/books/[id]/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { libroPorId } from "@/lib/google";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params; 
    const book = await libroPorId(id);
    if (!book) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(book, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Internal error", details: message },
      { status: 500 }
    );
  }
}

