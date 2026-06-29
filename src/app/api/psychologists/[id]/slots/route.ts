/**
 * GET /api/psychologists/[id]/slots
 * Retorna horários do psicólogo (livres e ocupados) para agendamento.
 * Query params: from (ISO), days (opcional, padrão 14, máx. 90).
 */
import { NextResponse } from "next/server";
import { getCalendarSlots } from "@/domain/scheduling";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString();
  const days = Math.min(Number(searchParams.get("days") ?? 14), 90);

  const slots = await getCalendarSlots(id, new Date(from), days);
  return NextResponse.json({ slots });
}
