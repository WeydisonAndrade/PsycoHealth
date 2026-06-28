/**
 * POST /api/auth/login
 * Autentica um usuário com e-mail e senha.
 * Métodos: POST
 * Autenticação: não requerida (endpoint público).
 * Em caso de sucesso, define o cookie de sessão e retorna os dados básicos do usuário.
 */
import { NextResponse } from "next/server";
import { loginSchema, login, AuthError } from "@/domain/auth";
import { setSessionCookie } from "@/lib/session";

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
    // Erros de credenciais inválidas
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    // Erros de validação do schema
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    // Erro genérico do servidor
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
