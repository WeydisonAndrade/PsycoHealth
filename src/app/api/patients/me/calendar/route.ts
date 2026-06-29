/**
 * GET /api/patients/me/calendar
 * Consultas do paciente autenticado para exibição no calendário.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getPatientCalendarEvents } from "@/domain/scheduling";

export async function GET(request: Request) {
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? new Date().toISOString();
  const days = Math.min(Number(searchParams.get("days") ?? 42), 90);

  const events = await getPatientCalendarEvents(session!.userId, new Date(from), days);

  return NextResponse.json({ events });
}
