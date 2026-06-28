/**
 * Sala de vídeo para consultas telepsicológicas.
 * Acesso restrito ao paciente e ao psicólogo participantes do agendamento.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAppointmentById } from "@/domain/scheduling";
import { VideoRoom } from "@/components/video/VideoRoom";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const appointment = await getAppointmentById(id);

  if (!appointment) redirect("/dashboard/patient");

  /** Verifica se o usuário logado é paciente ou psicólogo desta consulta */
  const isParticipant =
    appointment.patient.user.id === session.userId ||
    appointment.psychologist.user.id === session.userId;

  if (!isParticipant) redirect("/");

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Sessão de vídeo</h1>
        <p className="page-subtitle">
          Consulta com{" "}
          {session.role === "PATIENT"
            ? appointment.psychologist.user.name
            : appointment.patient.user.name}
        </p>
        {/* Componente de vídeo com sinalização WebRTC simulada */}
        <VideoRoom appointmentId={id} userRole={session.role as "PATIENT" | "PSYCHOLOGIST"} />
      </div>
    </div>
  );
}
