/**
 * Página de agendamento de consulta com um psicólogo.
 * Restrita a pacientes autenticados; carrega horários disponíveis via componente cliente.
 */
import { notFound, redirect } from "next/navigation";
import { getPublicProfile } from "@/domain/psychologist";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { BookAppointmentClient } from "./BookAppointmentClient";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /** Guardas de rota — apenas pacientes logados podem agendar */
  const session = await getSession();
  const { id } = await params;
  const bookPath = `/psychologists/${id}/book`;

  if (!session) redirect(getLoginPath(bookPath));
  if (session.role !== "PATIENT") redirect(getDashboardPath(session.role));

  const profile = await getPublicProfile(id);
  if (!profile) notFound();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Agendar com {profile.user.name}</h1>
        <p className="page-subtitle">Selecione um horário disponível</p>
        {/* Componente cliente com seleção de slot e redirecionamento ao pagamento */}
        <BookAppointmentClient psychologistId={id} />
      </div>
    </div>
  );
}
