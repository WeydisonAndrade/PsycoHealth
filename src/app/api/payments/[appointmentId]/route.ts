import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { getPaymentSummary, processPayment } from "@/domain/payment";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  const { appointmentId } = await params;
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
  const { session, error } = await requireAuth(["PATIENT"]);
  if (error) return error;

  const { appointmentId } = await params;

  try {
    const payment = await processPayment(appointmentId, session!.userId);
    return NextResponse.json({ payment });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro no pagamento" },
      { status: 400 }
    );
  }
}
