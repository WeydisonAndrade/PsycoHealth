/**
 * Painel do paciente autenticado.
 * Lista consultas agendadas com status de pagamento e link para nova consulta.
 */
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { getPatientAppointments } from "@/domain/scheduling";
import { AppointmentCard } from "@/components/scheduling/AppointmentCard";
import { Button } from "@/components/ui/Button";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function PatientDashboardPage() {
  /** Guardas de rota — redireciona visitantes e psicólogos para suas áreas */
  const session = await getSession();
  if (!session) redirect(getLoginPath("/dashboard/patient"));
  if (session.role !== "PATIENT") redirect(getDashboardPath(session.role));

  const appointments = await getPatientAppointments(session.userId);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Olá, {session.name}</h1>
            <p className="page-subtitle">Suas consultas e agendamentos</p>
          </div>
          <LogoutButton variant="ghost" size="sm" className="page-logout-btn" />
        </div>

        {/* Ação rápida para iniciar novo agendamento */}
        <div className="mb-3">
          <Link href="/psychologists">
            <Button fullWidth>Agendar nova consulta</Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem consultas agendadas.</p>
            <Link href="/psychologists" className="mt-2">
              Encontrar psicólogo
            </Link>
          </div>
        ) : (
          <div className="stack">
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
