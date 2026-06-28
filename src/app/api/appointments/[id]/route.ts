import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getAppointmentById, cancelAppointment } from "@/domain/scheduling";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return NextResponse.json({ error: "Consulta não encontrada" }, { status: 404 });
  }

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
  const { session, error } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  try {
    await cancelAppointment(id, session!.userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao cancelar" },
      { status: 400 }
    );
  }
}
