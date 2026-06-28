/**
 * GET /api/appointments/[id] — retorna detalhes de uma consulta específica.
 * DELETE /api/appointments/[id] — cancela uma consulta.
 * Métodos: GET, DELETE
 * Autenticação: requerida; o usuário deve ser participante da consulta (paciente ou psicólogo).
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAppointmentById, cancelAppointment } from "@/domain/scheduling";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificação de autenticação
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  // Busca da consulta via serviço de domínio
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 });
  }

  // Verificação de permissão: apenas participantes podem visualizar
  const isParticipant =
    appointment.patient.user.id === session!.userId ||
    appointment.psychologist.user.id === session!.userId;

  if (!isParticipant) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  return NextResponse.json({ appointment });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificação de autenticação
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    // Cancelamento via serviço de domínio
    await cancelAppointment(id, session!.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Tratamento de erros de domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao cancelar" },
      { status: 400 }
    );
  }
}
