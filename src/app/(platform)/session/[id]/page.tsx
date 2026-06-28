/**
 * Sala de vídeo para consultas telepsicológicas.
 * Acesso restrito ao paciente e ao psicólogo participantes do agendamento.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { getAppointmentById } from "@/domain/scheduling";
import { VideoRoom } from "@/components/video/VideoRoom";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;
  const sessionPath = `/session/${id}`;

  if (!session) redirect(getLoginPath(sessionPath));

  const appointment = await getAppointmentById(id);

  if (!appointment) redirect(getDashboardPath(session.role));

  const isParticipant =
    appointment.patient.user.id === session.userId ||
    appointment.psychologist.user.id === session.userId;

  if (!isParticipant) redirect(getDashboardPath(session.role));

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
