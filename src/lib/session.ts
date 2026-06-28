/**
 * Gerenciamento de sessão via JWT em cookie httpOnly.
 * O token carrega userId, email, name e role — usado em páginas e APIs.
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

/** Nome do cookie de sessão enviado ao navegador */
export const SESSION_COOKIE = "psycohealth_session";

/** Dados decodificados do JWT — identidade do usuário logado */
export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

/** Lê JWT_SECRET do ambiente e converte para formato exigido pelo jose */
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado");
  }
  return new TextEncoder().encode(secret);
}

/** Gera token JWT com validade de 7 dias */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/** Valida token e retorna payload, ou null se expirado/inválido */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Obtém sessão atual a partir do cookie da requisição (Server Components / Route Handlers) */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Define cookie de sessão após login ou cadastro */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true, // Inacessível via JavaScript — proteção contra XSS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

/** Remove cookie — usado no logout */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
