/**
 * GET /api/psychologists/me/earnings
 * Retorna o resumo de ganhos do psicólogo autenticado.
 * Métodos: GET
 * Autenticação: requerida (apenas role PSYCHOLOGIST).
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getPsychologistEarnings } from "@/domain/psychologist";

export async function GET() {
  // Verificação de autenticação e role
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    // Consulta de ganhos via serviço de domínio
    const earnings = await getPsychologistEarnings(session!.userId);
    return NextResponse.json(earnings);
  } catch (err) {
    // Tratamento de erros de domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 400 }
    );
  }
}
