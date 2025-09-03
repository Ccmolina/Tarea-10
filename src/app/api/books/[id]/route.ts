import { NextResponse } from "next/server";
import { libroPorId } from "@/lib/google";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await libroPorId(params.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error obteniendo libro:", error);
    return NextResponse.json({ error: "No se pudo obtener el libro" }, { status: 500 });
  }
}
