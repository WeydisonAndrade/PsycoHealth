import { listPsychologists } from "@/domain/psychologist";
import { PsychologistCard } from "@/components/psychologist/PsychologistCard";

export default async function PsychologistsPage() {
  const psychologists = await listPsychologists();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Psicólogos disponíveis</h1>
        <p className="page-subtitle">Encontre o profissional ideal para você</p>

        {psychologists.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum psicólogo cadastrado ainda.</p>
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
