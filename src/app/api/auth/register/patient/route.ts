import { NextResponse } from "next/server";
import { registerPatientSchema, registerPatient, AuthError } from "@/domain/auth";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerPatientSchema.parse(body);
    const { user, token } = await registerPatient(input);

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
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
