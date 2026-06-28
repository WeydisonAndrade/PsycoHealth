/**
 * Página de checkout do pagamento de uma consulta.
 * Exibe valor da consulta e só aceita o paciente dono do agendamento.
 */
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAppointmentById } from "@/domain/scheduling";
import { PaymentCheckout } from "@/components/payment/PaymentCheckout";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /** Guardas de rota e propriedade — apenas o paciente dono pode pagar */
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PATIENT") redirect("/dashboard/patient");

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) notFound();
  if (appointment.patient.user.id !== session.userId) redirect("/dashboard/patient");
  if (!appointment.payment) notFound();
  /** Consultas já pagas não precisam passar pelo checkout novamente */
  if (appointment.payment.status === "PAID") redirect("/dashboard/patient");

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
