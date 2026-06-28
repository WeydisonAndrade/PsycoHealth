/**
 * GET /api/payments/[appointmentId] — retorna o resumo do pagamento de uma consulta.
 * POST /api/payments/[appointmentId] — processa o pagamento da consulta.
 * Métodos: GET, POST
 * Autenticação: requerida (apenas role PATIENT).
 */
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getPaymentSummary, processPayment } from "@/domain/payment";
import { getAppointmentById } from "@/domain/scheduling";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  const { appointmentId } = await params;

  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  if (appointment.patient.user.id !== session!.userId) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const summary = await getPaymentSummary(appointmentId);

  if (!summary) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ payment: summary });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  // Verificação de autenticação e role de paciente
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  const { appointmentId } = await params;

  try {
    // Processamento do pagamento via serviço de domínio
    const payment = await processPayment(appointmentId, session!.userId);
    return NextResponse.json({ payment });
  } catch (err) {
    // Tratamento de erros de domínio
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro no pagamento" },
      { status: 400 }
    );
  }
}
