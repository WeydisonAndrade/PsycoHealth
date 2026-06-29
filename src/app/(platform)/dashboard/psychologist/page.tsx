/**
 * Painel do psicólogo autenticado.
 * Reúne ganhos, edição de perfil, disponibilidade e lista de consultas agendadas.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { getProfileByUserId, getPsychologistEarnings } from "@/domain/psychologist";
import { getPsychologistAppointments } from "@/domain/scheduling";
import { ProfileForm } from "@/components/psychologist/ProfileForm";
import { AvailabilityEditor } from "@/components/psychologist/AvailabilityEditor";
import { EarningsSummary } from "@/components/psychologist/EarningsSummary";
import { AppointmentCard } from "@/components/scheduling/AppointmentCard";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default async function PsychologistDashboardPage() {
  /** Guardas de rota — redireciona visitantes e pacientes para suas áreas */
  const session = await getSession();
  if (!session) redirect(getLoginPath("/dashboard/psychologist"));
  if (session.role !== "PSYCHOLOGIST") redirect(getDashboardPath(session.role));

  const profile = await getProfileByUserId(session.userId);
  if (!profile) redirect("/register/psychologist");

  const appointments = await getPsychologistAppointments(session.userId);
  const earnings = await getPsychologistEarnings(session.userId);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Olá, {session.name}</h1>
            <p className="page-subtitle">Painel do psicólogo — CRP {profile.crp}</p>
          </div>
          <LogoutButton variant="ghost" size="sm" className="page-logout-btn" />
        </div>

        {/* Resumo financeiro — total recebido e histórico de pagamentos */}
        <div className="mb-3">
          <EarningsSummary
            totalEarnings={earnings.totalEarnings}
            totalSessions={earnings.totalSessions}
            payments={earnings.payments}
          />
        </div>

        {/* Edição de perfil profissional e grade de horários disponíveis */}
        <div className="grid-2 mb-3">
          <ProfileForm initial={profile} />
          <AvailabilityEditor initialSlots={profile.availability} />
        </div>

        {/* Lista de consultas com pacientes */}
        <h2 className="section-heading">Minhas consultas</h2>
        {appointments.length === 0 ? (
          <div className="empty-state">Nenhuma consulta agendada</div>
        ) : (
          <div className="stack">
            {appointments.map((a) => (
              <AppointmentCard
                key={a.id}
                id={a.id}
                scheduledAt={a.scheduledAt}
                status={a.status}
                patientName={a.patient.user.name}
                paymentStatus={a.payment?.status}
                role="PSYCHOLOGIST"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
