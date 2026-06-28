/**
 * Perfil público de um psicólogo específico.
 * Exibe bio, especialidades, preço e CTA de agendamento (condicionado ao login).
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProfile } from "@/domain/psychologist";
import { getSession } from "@/lib/session";
import { getDashboardPath, getLoginPath } from "@/lib/auth-routes";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default async function PsychologistProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getPublicProfile(id);
  if (!profile) notFound();

  /** Sessão atual — usada para decidir se o usuário pode agendar */
  const session = await getSession();
  const bookPath = `/psychologists/${id}/book`;

  return (
    <div className="page">
      <div className="container">
        <div className="grid-2">
          {/* Coluna esquerda — informações do perfil profissional */}
          <div>
            <h1 className="page-title">{profile.user.name}</h1>
            <p className="page-subtitle">CRP {profile.crp}</p>

            {profile.bio && (
              <Card title="Sobre" className="mb-3">
                <p>{profile.bio}</p>
              </Card>
            )}

            <Card title="Especialidades" className="mb-3">
              <div className="tags">
                {profile.specialties.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            <p className="price-display mb-3">{formatCurrency(profile.sessionPrice)} por sessão</p>
          </div>

          <Card title="Agendar consulta">
            {!session ? (
              <>
                <p className="muted-text mb-2">
                  Faça login como paciente para agendar uma consulta.
                </p>
                <Link href={getLoginPath(bookPath)}>
                  <Button fullWidth>Entrar</Button>
                </Link>
                <p className="auth-links mt-2">
                  <Link href={`/register/patient?next=${encodeURIComponent(bookPath)}`}>
                    Criar conta de paciente
                  </Link>
                </p>
              </>
            ) : session.role !== "PATIENT" ? (
              <p className="muted-text">
                Apenas pacientes podem agendar consultas.{" "}
                <Link href={getDashboardPath(session.role)}>Ir para minha área</Link>
              </p>
            ) : (
              <Link href={`/psychologists/${id}/book`}>
                <Button fullWidth>Escolher horário</Button>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
