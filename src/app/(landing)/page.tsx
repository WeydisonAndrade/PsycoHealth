import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80";

/** Página inicial — markup fiel ao legacy/index.html */
export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="hero-content animate-on-scroll">
            <h1 id="hero-title">
              Saúde mental e <span>autoconhecimento</span>.
            </h1>
            <p className="subtitle">
              Um espaço de reflexão e acolhimento. Conhecer a si mesmo é o princípio da sabedoria
              — estamos aqui para caminhar com você.
            </p>
            <a href="#agendar" className="btn btn-primary btn-lg">
              Agendar Consulta
            </a>
          </div>
          <div className="hero-image animate-on-scroll delay-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Escultura clássica em pose reflexiva, representando introspecção e a mente humana"
              width={600}
              height={750}
            />
          </div>
        </div>
      </section>

      <section id="sobre" className="about" aria-labelledby="sobre-title">
        <div className="container animate-on-scroll">
          <p className="section-label">Quem somos</p>
          <h2 id="sobre-title" className="section-title">
            Sobre o Psicólogo
          </h2>
          <p className="section-subtitle">
            Atendimento baseado em evidências, com empatia e respeito à sua história.
          </p>
          <p>
            Atuamos na psicologia clínica com uma visão que une o rigor técnico ao acolhimento.
            Nosso objetivo é criar um ambiente de confiança onde você possa refletir,
            compreender-se melhor e encontrar recursos para lidar com ansiedade, estresse, humor e
            relações.
          </p>
          <p>
            Seja para uma primeira avaliação ou para um acompanhamento contínuo, estamos ao seu
            lado em busca de equilíbrio emocional e bem-estar.
          </p>
        </div>
      </section>

      <section id="areas" className="areas section-textured" aria-labelledby="areas-title">
        <div className="container">
          <p className="section-label animate-on-scroll">Atendimento</p>
          <h2 id="areas-title" className="section-title animate-on-scroll">
            Áreas de Atendimento
          </h2>
          <p className="section-subtitle animate-on-scroll">
            Trabalhamos com as principais demandas da saúde mental.
          </p>
          <div className="card-grid areas">
            <a href="/ansiedade.html" className="card animate-on-scroll" aria-label="Saiba mais sobre ansiedade">
              <div className="icon">◆</div>
              <h3>Ansiedade</h3>
              <p>Técnicas para reduzir preocupação excessiva, inquietação e medos que impactam o dia a dia.</p>
            </a>
            <a href="/depressao.html" className="card animate-on-scroll delay-1" aria-label="Saiba mais sobre depressão">
              <div className="icon">◆</div>
              <h3>Depressão</h3>
              <p>Apoio para recuperar ânimo, sono e interesse por atividades, com escuta e estratégias personalizadas.</p>
            </a>
            <a href="/burnout.html" className="card animate-on-scroll delay-2" aria-label="Saiba mais sobre burnout">
              <div className="icon">◆</div>
              <h3>Burnout</h3>
              <p>Tratamento do esgotamento profissional e emocional, com foco em limites e equilíbrio.</p>
            </a>
            <a href="/sindrome-panico.html" className="card animate-on-scroll delay-3" aria-label="Saiba mais sobre síndrome do pânico">
              <div className="icon">◆</div>
              <h3>Síndrome do Pânico</h3>
              <p>Abordagem para entender e controlar crises de pânico e retomar a sensação de segurança.</p>
            </a>
            <a href="/estresse.html" className="card animate-on-scroll" aria-label="Saiba mais sobre estresse">
              <div className="icon">◆</div>
              <h3>Estresse</h3>
              <p>Estratégias para gerenciar a pressão do cotidiano e evitar que o estresse prejudique sua saúde.</p>
            </a>
            <a href="/baixa-autoestima.html" className="card animate-on-scroll delay-1" aria-label="Saiba mais sobre baixa autoestima">
              <div className="icon">◆</div>
              <h3>Baixa Autoestima</h3>
              <p>Construção de uma visão mais gentil sobre si mesmo, aumentando confiança e autocuidado.</p>
            </a>
            <a href="/problemas-relacionamento.html" className="card animate-on-scroll delay-2" aria-label="Saiba mais sobre problemas de relacionamento">
              <div className="icon">◆</div>
              <h3>Problemas de Relacionamento</h3>
              <p>Reflexão sobre comunicação e dinâmicas que impactam casais, família e amizades.</p>
            </a>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="how" aria-labelledby="how-title">
        <div className="container">
          <p className="section-label animate-on-scroll">Processo</p>
          <h2 id="how-title" className="section-title animate-on-scroll">
            Como Funciona a Terapia
          </h2>
          <p className="section-subtitle animate-on-scroll">
            Do primeiro contato ao acompanhamento contínuo.
          </p>
          <div className="steps">
            <article className="step animate-on-scroll">
              <h3>Agendamento</h3>
              <p>Entre em contato por telefone ou WhatsApp e agende seu horário de forma rápida e discreta.</p>
            </article>
            <article className="step animate-on-scroll delay-1">
              <h3>Primeira sessão</h3>
              <p>Na primeira sessão, conversamos sobre sua história e suas queixas para entender como podemos ajudar.</p>
            </article>
            <article className="step animate-on-scroll delay-2">
              <h3>Plano terapêutico personalizado</h3>
              <p>Com base na avaliação, definimos juntos os objetivos e o plano de tratamento adequado para você.</p>
            </article>
            <article className="step animate-on-scroll delay-3">
              <h3>Acompanhamento contínuo</h3>
              <p>Sessões regulares dedicadas ao trabalho contínuo, com apoio e técnicas para sua evolução.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="beneficios" className="benefits section-textured" aria-labelledby="beneficios-title">
        <div className="container">
          <p className="section-label animate-on-scroll">Ganhos</p>
          <h2 id="beneficios-title" className="section-title animate-on-scroll">
            Benefícios da Terapia
          </h2>
          <p className="section-subtitle animate-on-scroll">
            Investir em terapia é investir em uma vida mais consciente e equilibrada.
          </p>
          <div className="card-grid">
            <div className="card animate-on-scroll">
              <div className="icon">◇</div>
              <h3>Equilíbrio emocional</h3>
              <p>Desenvolver recursos para lidar com as emoções de forma mais estável e saudável.</p>
            </div>
            <div className="card animate-on-scroll delay-1">
              <div className="icon">◇</div>
              <h3>Clareza mental</h3>
              <p>Organizar pensamentos e emoções para tomar decisões com mais segurança.</p>
            </div>
            <div className="card animate-on-scroll delay-2">
              <div className="icon">◇</div>
              <h3>Relacionamentos mais saudáveis</h3>
              <p>Melhorar comunicação e vínculos com as pessoas que importam.</p>
            </div>
            <div className="card animate-on-scroll delay-3">
              <div className="icon">◇</div>
              <h3>Autoconhecimento</h3>
              <p>Conhecer melhor a si mesmo e seus padrões para mudar o que for necessário.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="agendar" className="cta-section" aria-labelledby="cta-title">
        <div className="container animate-on-scroll">
          <h2 id="cta-title">
            Dê o primeiro passo <span>hoje</span>.
          </h2>
          <p>
            Agende sua consulta e comece a cuidar da sua saúde mental em um espaço de reflexão e
            acolhimento.
          </p>
          <Link href="/psychologists" className="btn btn-secondary">
            Agendar Consulta
          </Link>
        </div>
      </section>
    </>
  );
}
