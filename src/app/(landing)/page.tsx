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

      <section id="contato" className="contact" aria-labelledby="contato-title">
        <div className="container">
          <p className="section-label animate-on-scroll">Fale conosco</p>
          <h2 id="contato-title" className="section-title animate-on-scroll">
            Contato
          </h2>
          <p className="section-subtitle animate-on-scroll">
            Estamos à disposição para dúvidas e agendamentos.
          </p>
          <div className="contact-grid">
            <a href="tel:+5511999999999" className="contact-item">
              <span className="icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <span>Telefone</span>
                <small>(11) 99999-9999</small>
              </div>
            </a>
            <a
              href="https://wa.me/5511999999999"
              className="contact-item whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="icon">
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <div>
                <span>WhatsApp</span>
                <small>Envie uma mensagem</small>
              </div>
            </a>
            <a href="mailto:contato@psicohealth.com.br" className="contact-item">
              <span className="icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </span>
              <div>
                <span>E-mail</span>
                <small>contato@psicohealth.com.br</small>
              </div>
            </a>
            <div className="contact-item static">
              <span className="icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <span>Endereço</span>
                <small>Rua Exemplo, 123 — São Paulo, SP</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
