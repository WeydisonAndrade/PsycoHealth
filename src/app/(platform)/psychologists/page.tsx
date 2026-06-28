/**
 * Catálogo público de psicólogos cadastrados na plataforma.
 * Aceita filtro ?specialty= via query string (links da landing de áreas).
 */
import { listPsychologists } from "@/domain/psychologist";
import { PsychologistCard } from "@/components/psychologist/PsychologistCard";

export default async function PsychologistsPage({
  searchParams,
}: {
  searchParams: Promise<{ specialty?: string }>;
}) {
  const { specialty } = await searchParams;
  const psychologists = await listPsychologists(
    specialty ? { specialty } : undefined
  );

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Psicólogos disponíveis</h1>
        <p className="page-subtitle">
          {specialty
            ? `Especialidade: ${specialty}`
            : "Encontre o profissional ideal para você"}
        </p>

        {psychologists.length === 0 ? (
          <div className="empty-state">
            <p>
              {specialty
                ? `Nenhum psicólogo encontrado para "${specialty}".`
                : "Nenhum psicólogo cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {psychologists.map((p) => (
              <PsychologistCard
                key={p.id}
                id={p.id}
                name={p.user.name}
                crp={p.crp}
                bio={p.bio}
                specialties={p.specialties}
                sessionPrice={p.sessionPrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
