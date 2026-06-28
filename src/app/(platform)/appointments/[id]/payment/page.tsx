/**
 * Página de checkout do pagamento de uma consulta.
 * Exibe valor da consulta e só aceita o paciente dono do agendamento.
 */
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { getAppointmentById } from "@/domain/scheduling";
import { PaymentCheckout } from "@/components/payment/PaymentCheckout";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /** Guardas de rota e propriedade — apenas o paciente dono pode pagar */
  const session = await getSession();
  const { id } = await params;
  const paymentPath = `/appointments/${id}/payment`;

  if (!session) redirect(getLoginPath(paymentPath));
  if (session.role !== "PATIENT") redirect(getDashboardPath(session.role));

  const appointment = await getAppointmentById(id);

  if (!appointment) notFound();
  if (appointment.patient.user.id !== session.userId) redirect(getDashboardPath("PATIENT"));
  if (!appointment.payment) notFound();
  if (appointment.payment.status === "PAID") redirect(getDashboardPath("PATIENT"));

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Pagamento</h1>
        <p className="page-subtitle">Confirme o pagamento para liberar sua consulta</p>
        <PaymentCheckout
          appointmentId={id}
          totalAmount={appointment.payment.totalAmount}
          psychologistName={appointment.psychologist.user.name}
        />
      </div>
    </div>
  );
}
