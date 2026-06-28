/**
 * Catálogo público de psicólogos cadastrados na plataforma.
 * Server Component — busca a lista no servidor e renderiza cards clicáveis.
 */
import { listPsychologists } from "@/domain/psychologist";
import { PsychologistCard } from "@/components/psychologist/PsychologistCard";

export default async function PsychologistsPage() {
  /** Lista completa de perfis públicos disponíveis para agendamento */
  const psychologists = await listPsychologists();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Psicólogos disponíveis</h1>
        <p className="page-subtitle">Encontre o profissional ideal para você</p>

        {psychologists.length === 0 ? (
          /* Estado vazio quando ainda não há profissionais cadastrados */
          <div className="empty-state">
            <p>Nenhum psicólogo cadastrado ainda.</p>
          </div>
        ) : (
          /* Grade responsiva com um card por psicólogo */
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
