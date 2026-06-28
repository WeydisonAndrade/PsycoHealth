import { notFound, redirect } from "next/navigation";
import { getPublicProfile } from "@/domain/psychologist";
import { getSession } from "@/lib/session";
import { BookAppointmentClient } from "./BookAppointmentClient";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "PATIENT") redirect("/psychologists");

  const { id } = await params;
  const profile = await getPublicProfile(id);
  if (!profile) notFound();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Agendar com {profile.user.name}</h1>
        <p className="page-subtitle">Selecione um horário disponível</p>
        <BookAppointmentClient psychologistId={id} />
      </div>
    </div>
  );
}
