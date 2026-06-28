/**
 * POST /api/auth/login
 * Autentica um usuário com e-mail e senha.
 * Métodos: POST
 * Autenticação: não requerida (endpoint público).
 * Em caso de sucesso, define o cookie de sessão e retorna os dados básicos do usuário.
 */
import { NextResponse } from "next/server";
import { loginSchema, login } from "@/domain/auth";
import { setSessionCookie } from "@/lib/session";
import { mapAuthRouteError } from "@/lib/http-errors";

export async function POST(request: Request) {
  try {
    // Validação do corpo da requisição
    const body = await request.json();
    const input = loginSchema.parse(body);

    // Autenticação via serviço de domínio
    const { user, token } = await login(input);

    // Persistência da sessão no cookie HTTP-only
    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const mapped = mapAuthRouteError(error);
    if (mapped) {
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
