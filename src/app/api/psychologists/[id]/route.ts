/**
 * GET /api/psychologists/[id]
 * Retorna o perfil público de um psicólogo pelo ID.
 * Métodos: GET
 * Autenticação: não requerida (endpoint público).
 */
import { NextResponse } from "next/server";
import { getPublicProfile } from "@/domain/psychologist";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Busca do perfil público via serviço de domínio
  const profile = await getPublicProfile(id);

  if (!profile) {
    return NextResponse.json({ error: "Psicólogo não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}
