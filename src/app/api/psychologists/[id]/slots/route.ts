/**
 * GET /api/psychologists/[id]/slots
 * Retorna os horários disponíveis para agendamento com um psicólogo.
 * Métodos: GET
 * Autenticação: não requerida (endpoint público).
 * Query params: from (opcional, ISO date — padrão: data/hora atual).
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAvailableSlots } from "@/domain/scheduling";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Extração do parâmetro de data inicial
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString();

  // Cálculo de slots disponíveis via serviço de domínio
  const slots = await getAvailableSlots(id, new Date(from));
  return NextResponse.json({ slots });
}
