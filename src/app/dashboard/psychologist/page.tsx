import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProfileByUserId, getPsychologistEarnings } from "@/domain/psychologist";
import { getPsychologistAppointments } from "@/domain/scheduling";
import { ProfileForm } from "@/components/psychologist/ProfileForm";
import { AvailabilityEditor } from "@/components/psychologist/AvailabilityEditor";
import { EarningsSummary } from "@/components/psychologist/EarningsSummary";
import { AppointmentCard } from "@/components/scheduling/AppointmentCard";

export default async function PsychologistDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PSYCHOLOGIST") redirect("/dashboard/patient");

  const profile = await getProfileByUserId(session.userId);
  if (!profile) redirect("/register/psychologist");

  const appointments = await getPsychologistAppointments(session.userId);
  const earnings = await getPsychologistEarnings(session.userId);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Olá, {session.name}</h1>
        <p className="page-subtitle">Painel do psicólogo — CRP {profile.crp}</p>

        <div className="mb-3">
          <EarningsSummary
            totalEarnings={earnings.totalEarnings}
            totalSessions={earnings.totalSessions}
            payments={earnings.payments}
          />
        </div>

        <div className="grid-2 mb-3">
          <ProfileForm initial={profile} />
          <AvailabilityEditor initialSlots={profile.availability} />
        </div>

        <h2 className="section-title" style={{ textAlign: "left", fontSize: "1.75rem", marginBottom: "1rem" }}>
          Minhas consultas
        </h2>
        {appointments.length === 0 ? (
          <div className="empty-state">Nenhuma consulta agendada</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
