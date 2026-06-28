/**
 * GET /api/psychologists/me — retorna o perfil do psicólogo autenticado.
 * PATCH /api/psychologists/me — atualiza dados do perfil.
 * PUT /api/psychologists/me — define a disponibilidade semanal.
 * Métodos: GET, PATCH, PUT
 * Autenticação: requerida (apenas role PSYCHOLOGIST).
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  getProfileByUserId,
  updateProfile,
  setAvailability,
  updateProfileSchema,
  setAvailabilitySchema,
} from "@/domain/psychologist";

export async function GET() {
  // Verificação de autenticação e role
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  // Busca do perfil do psicólogo logado
  const profile = await getProfileByUserId(session!.userId);
  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  // Verificação de autenticação e role
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    // Validação e atualização do perfil
    const body = await request.json();
    const input = updateProfileSchema.parse(body);
    const profile = await updateProfile(session!.userId, input);
    return NextResponse.json({ profile });
  } catch (err) {
    // Tratamento de erros de validação ou domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao atualizar" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  // Verificação de autenticação e role
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    // Validação e persistência da disponibilidade
    const body = await request.json();
    const input = setAvailabilitySchema.parse(body);
    const profile = await setAvailability(session!.userId, input);
    return NextResponse.json({ profile });
  } catch (err) {
    // Tratamento de erros de validação ou domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar disponibilidade" },
      { status: 400 }
    );
  }
}
