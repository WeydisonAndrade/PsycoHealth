/**
 * GET /api/appointments — lista consultas do usuário autenticado (paciente ou psicólogo).
 * POST /api/appointments — agenda uma nova consulta.
 * Métodos: GET, POST
 * Autenticação: GET requer sessão (qualquer role); POST requer role PATIENT.
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  bookAppointmentSchema,
  bookAppointment,
  getPatientAppointments,
  getPsychologistAppointments,
} from "@/domain/scheduling";

export async function GET() {
  // Verificação de autenticação
  const { session, error } = await requireAuth();
  if (error) return error;

  // Listagem conforme o papel do usuário
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
  // Verificação de autenticação e role de paciente
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  try {
    // Validação e criação do agendamento
    const body = await request.json();
    const input = bookAppointmentSchema.parse(body);
    const result = await bookAppointment(session!.userId, input);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    // Tratamento de erros de validação ou domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao agendar" },
      { status: 400 }
    );
  }
}
