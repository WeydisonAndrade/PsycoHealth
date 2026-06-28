/**
 * Painel do paciente autenticado.
 * Lista consultas agendadas com status de pagamento e link para nova consulta.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getPatientAppointments } from "@/domain/scheduling";
import { AppointmentCard } from "@/components/scheduling/AppointmentCard";
import { Button } from "@/components/ui/Button";

export default async function PatientDashboardPage() {
  /** Guardas de rota — redireciona visitantes e psicólogos para suas áreas */
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PATIENT") redirect("/dashboard/psychologist");

  const appointments = await getPatientAppointments(session.userId);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Olá, {session.name}</h1>
        <p className="page-subtitle">Suas consultas e agendamentos</p>

        {/* Ação rápida para iniciar novo agendamento */}
        <div className="mb-3">
          <Link href="/psychologists">
            <Button>Agendar nova consulta</Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          /* Estado vazio com link para o catálogo de psicólogos */
          <div className="empty-state">
            <p>Você ainda não tem consultas agendadas.</p>
            <Link href="/psychologists" className="mt-2" style={{ display: "inline-block" }}>
              Encontrar psicólogo
            </Link>
          </div>
        ) : (
          /* Lista cronológica de consultas do paciente */
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {appointments.map((a) => (
              <AppointmentCard
                key={a.id}
                id={a.id}
                scheduledAt={a.scheduledAt}
                status={a.status}
                psychologistName={a.psychologist.user.name}
                paymentStatus={a.payment?.status}
                sessionPrice={a.payment?.totalAmount}
                role="PATIENT"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
