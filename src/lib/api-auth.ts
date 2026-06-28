/**
 * Guard de autenticação para Route Handlers (API).
 * Retorna sessão válida ou NextResponse de erro (401/403).
 */

import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";

/**
 * Exige usuário autenticado. Opcionalmente restringe por role.
 * @param roles — Se informado, apenas esses papéis passam (ex: ["PATIENT"])
 */
export async function requireAuth(roles?: UserRole[]): Promise<
  | { session: SessionPayload; error: null }
  | { session: null; error: NextResponse }
> {
  const session = await getSession();

  // Sem cookie ou token inválido
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }),
    };
  }

  // Role não autorizada para este endpoint
  if (roles && !roles.includes(session.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
