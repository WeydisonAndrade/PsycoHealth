import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  bookAppointmentSchema,
  bookAppointment,
  getPatientAppointments,
  getPsychologistAppointments,
} from "@/domain/scheduling";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (session!.role === "PATIENT") {
    const appointments = await getPatientAppointments(session!.userId);
    return NextResponse.json({ appointments });
  }

  if (session!.role === "PSYCHOLOGIST") {
    const appointments = await getPsychologistAppointments(session!.userId);
    return NextResponse.json({ appointments });
  }

  return NextResponse.json({ appointments: [] });
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  try {
    const body = await request.json();
    const input = bookAppointmentSchema.parse(body);
    const result = await bookAppointment(session!.userId, input);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao agendar" },
      { status: 400 }
    );
  }
}
