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

  // Busca de psicólogos via serviço de domínio
  const psychologists = await listPsychologists({ specialty });
  return NextResponse.json({ psychologists });
}
