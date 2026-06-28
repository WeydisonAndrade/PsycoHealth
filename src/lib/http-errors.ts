/**
 * Mapeamento consistente de erros de validação e domínio para respostas HTTP.
 */
import { ZodError } from "zod";
import { AuthError } from "@/domain/auth";

export function mapAuthRouteError(error: unknown): { message: string; status: number } | null {
  if (error instanceof AuthError) {
    if (error.code === "INVALID_CREDENTIALS") {
      return { message: error.message, status: 401 };
    }
    return { message: error.message, status: 409 };
  }

  if (error instanceof ZodError) {
    return { message: "Dados inválidos", status: 400 };
  }

  return null;
}
