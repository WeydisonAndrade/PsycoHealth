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
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  const profile = await getProfileByUserId(session!.userId);
  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    const body = await request.json();
    const input = updateProfileSchema.parse(body);
    const profile = await updateProfile(session!.userId, input);
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao atualizar" },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  try {
    const body = await request.json();
    const input = setAvailabilitySchema.parse(body);
    const profile = await setAvailability(session!.userId, input);
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao salvar disponibilidade" },
      { status: 400 }
    );
  }
}
