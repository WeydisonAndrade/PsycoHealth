/**
 * Rotas de autenticação — entrada, saída e dashboards por papel.
 */
import type { UserRole } from "@prisma/client";

/** Dashboard principal conforme o papel do usuário */
export function getDashboardPath(role: UserRole | string): string {
  return role === "PSYCHOLOGIST" ? "/dashboard/psychologist" : "/dashboard/patient";
}

/** Valida redirecionamento interno (evita open redirect) */
export function isSafeRedirectPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

/** URL de login com retorno opcional após autenticação */
export function getLoginPath(next?: string): string {
  if (!next || !isSafeRedirectPath(next)) {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Destino pós-login/cadastro: prioriza ?next= quando seguro */
export function resolvePostAuthPath(role: UserRole | string, next?: string | null): string {
  if (next && isSafeRedirectPath(next)) {
    return next;
  }
  return getDashboardPath(role);
}

/** Rota pública após logout */
export const LOGOUT_REDIRECT_PATH = "/";
