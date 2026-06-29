/**
 * GET /api/psychologists/me/calendar
 * Calendário do psicólogo autenticado com nomes dos pacientes nos horários ocupados.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getProfileByUserId } from "@/domain/psychologist";
import { getCalendarSlots } from "@/domain/scheduling";

export async function GET(request: Request) {
  const { session, error } = await requireAuth(["PSYCHOLOGIST"]);
  if (error) return error;

  const profile = await getProfileByUserId(session!.userId);
  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString();
  const days = Math.min(Number(searchParams.get("days") ?? 42), 90);

  const slots = await getCalendarSlots(profile.id, new Date(from), days, {
    includeBookingDetails: true,
  });

  return NextResponse.json({ slots });
}
