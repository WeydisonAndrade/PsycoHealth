import { NextResponse } from "next/server";
import type { UserRole } from "@prisma/client";
import { getSession, type SessionPayload } from "./session";

export async function requireAuth(roles?: UserRole[]): Promise<
  | { session: SessionPayload; error: null }
  | { session: null; error: NextResponse }
> {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autenticado" }, { status: 401 }),
    };
  }

  if (roles && !roles.includes(session.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Acesso negado" }, { status: 403 }),
    };
  }

  return { session, error: null };
}
