import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Cuidado psicológico, onde você estiver</h1>
            <p className="hero-subtitle">
              Conectamos pacientes e psicólogos qualificados. Agende, pague e realize
              consultas por vídeo com segurança.
            </p>
            <div className="hero-actions">
              <Link href="/psychologists">
                <Button size="lg">Encontrar psicólogo</Button>
              </Link>
              <Link href="/register/patient">
                <Button size="lg" variant="secondary">
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Como funciona</h2>
          <div className="grid-3">
            <div className="feature-card card">
              <div className="feature-icon">1</div>
              <h3>Cadastre-se</h3>
              <p>Pacientes e psicólogos criam conta na plataforma em minutos.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">2</div>
              <h3>Agende e pague</h3>
              <p>Escolha horário, pague online com split automático de 20% para a plataforma.</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">3</div>
              <h3>Consulta por vídeo</h3>
              <p>Entre na sala segura no horário marcado e inicie sua sessão.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container text-center">
          <h2 className="section-title">Para psicólogos</h2>
          <p className="page-subtitle" style={{ maxWidth: 600, margin: "0 auto 2rem" }}>
            Expanda seu consultório online. Você recebe 80% de cada consulta — a plataforma
            retém 20% automaticamente.
          </p>
          <Link href="/register/psychologist">
            <Button size="lg">Cadastrar como psicólogo</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
