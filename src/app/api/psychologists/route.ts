/**
 * GET /api/psychologists
 * Lista psicólogos disponíveis na plataforma, com filtro opcional por especialidade.
 * Métodos: GET
 * Autenticação: não requerida (endpoint público).
 * Query params: specialty (opcional).
 */
import { NextResponse } from "next/server";
import { listPsychologists } from "@/domain/psychologist";

export async function GET(request: Request) {
  // Extração de filtros da query string
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty") ?? undefined;
  const bookable = searchParams.get("bookable") === "true";

  let psychologists = await listPsychologists({ specialty });
  if (bookable) {
    psychologists = psychologists.filter((p) => p.availability.length > 0);
  }
  return NextResponse.json({ psychologists });
}
