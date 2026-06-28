/**
 * POST /api/auth/register/patient
 * Cadastra um novo paciente na plataforma.
 * Métodos: POST
 * Autenticação: não requerida (endpoint público).
 * Em caso de sucesso, cria a conta, define o cookie de sessão e retorna os dados do usuário.
 */
import { NextResponse } from "next/server";
import { registerPatientSchema, registerPatient } from "@/domain/auth";
import { setSessionCookie } from "@/lib/session";
import { mapAuthRouteError } from "@/lib/http-errors";

export async function POST(request: Request) {
  try {
    // Validação do corpo da requisição
    const body = await request.json();
    const input = registerPatientSchema.parse(body);

    // Criação do paciente via serviço de domínio
    const { user, token } = await registerPatient(input);

    // Persistência da sessão no cookie HTTP-only
    await setSessionCookie(token);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const mapped = mapAuthRouteError(error);
    if (mapped) {
      return NextResponse.json({ error: mapped.message }, { status: mapped.status });
    }
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
