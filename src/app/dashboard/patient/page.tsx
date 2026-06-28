import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getPatientAppointments } from "@/domain/scheduling";
import { AppointmentCard } from "@/components/scheduling/AppointmentCard";
import { Button } from "@/components/ui/Button";

export default async function PatientDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PATIENT") redirect("/dashboard/psychologist");

  const appointments = await getPatientAppointments(session.userId);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Olá, {session.name}</h1>
        <p className="page-subtitle">Suas consultas e agendamentos</p>

        <div className="mb-3">
          <Link href="/psychologists">
            <Button>Agendar nova consulta</Button>
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem consultas agendadas.</p>
            <Link href="/psychologists" className="mt-2" style={{ display: "inline-block" }}>
              Encontrar psicólogo
            </Link>
          </div>
        ) : (
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
