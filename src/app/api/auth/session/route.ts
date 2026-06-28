/**
 * GET /api/auth/session — retorna a sessão atual do usuário autenticado.
 * POST /api/auth/session — encerra a sessão (logout).
 * Métodos: GET, POST
 * Autenticação: GET lê o cookie de sessão (retorna null se ausente); POST não exige sessão ativa.
 */
import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/session";

export async function POST() {
  // Remove o cookie de sessão (logout)
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Consulta a sessão armazenada no cookie
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: session });
}
