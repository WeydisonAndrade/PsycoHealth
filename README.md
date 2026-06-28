# PsycoHealth — MVP Telepsicologia

Plataforma de telepsicologia com cadastro de psicólogos e pacientes, agendamento, pagamento com comissão automática de 20% e videochamada.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Prisma** + SQLite (desenvolvimento)
- **JWT** em cookie httpOnly (autenticação)
- **Jitsi Meet** (videochamada)
- Pagamento simulado (pronto para integrar Stripe/Mercado Pago)

## MVP — Regras de negócio

| Feature | Rota / Módulo |
|---------|---------------|
| Cadastro de psicólogo | `/register/psychologist` · `src/domain/auth/` |
| Cadastro de paciente | `/register/patient` · `src/domain/auth/` |
| Login | `/login` · `src/domain/auth/` |
| Perfil do psicólogo | `/psychologists/[id]` · `src/domain/psychologist/` |
| Agendamento | `/psychologists/[id]/book` · `src/domain/scheduling/` |
| Pagamento + comissão 20% | `/appointments/[id]/payment` · `src/domain/payment/` |
| Videochamada | `/session/[id]` · `src/domain/video/` |

## Estrutura do projeto

```text
src/
├── app/                    # Páginas e API routes (Next.js)
│   ├── api/
│   │   ├── auth/           # Login, registro, sessão
│   │   ├── psychologists/  # Listagem, perfil, disponibilidade
│   │   ├── appointments/   # Agendamentos
│   │   ├── payments/       # Checkout e confirmação
│   │   └── video/          # Sala de vídeo
│   ├── dashboard/          # Painéis paciente e psicólogo
│   ├── psychologists/      # Listagem e perfil público
│   └── session/            # Videochamada
├── components/
│   ├── auth/               # Formulários de login e cadastro
│   ├── psychologist/       # Cards, perfil, disponibilidade, ganhos
│   ├── scheduling/         # Agendamento e lista de consultas
│   ├── payment/            # Checkout
│   ├── video/              # Sala Jitsi
│   ├── layout/             # Header e Footer
│   └── ui/                 # Botões, inputs, cards
├── domain/                 # Regras de negócio (sem UI)
│   ├── auth/
│   ├── psychologist/
│   ├── scheduling/
│   ├── payment/            # calculateSplit() — comissão 20%
│   └── video/
└── lib/                    # DB, sessão, utilitários
legacy/                     # Landing page HTML original
prisma/                     # Schema e seed
```

## Como rodar

```bash
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Criar banco e seed de demonstração
npm run db:push
npm run db:seed

# Desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Contas de demonstração (seed)

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Psicólogo | psicologo@psycohealth.com | senha123 |
| Paciente | paciente@psycohealth.com | senha123 |

## Fluxo do MVP

1. Paciente se cadastra e faz login
2. Busca psicólogo em `/psychologists`
3. Escolhe horário e agenda consulta
4. Paga (simulado) — plataforma retém **20%**, psicólogo recebe **80%**
5. Na hora da consulta, entra em `/session/[id]` (Jitsi Meet)
6. Psicólogo gerencia perfil, disponibilidade e vê ganhos no dashboard

## Comissão automática

A regra está em `src/domain/payment/commission.ts`:

```typescript
export const PLATFORM_COMMISSION_RATE = 0.2;

export function calculateSplit(totalAmount: number) {
  const platformCommission = totalAmount * 0.20;
  const psychologistPayout = totalAmount - platformCommission;
  // ...
}
```

Cada pagamento registra `totalAmount`, `platformCommission`, `psychologistPayout` e `commissionRate` no banco.

## Próximos passos (pós-MVP)

- Integrar gateway real (Stripe Connect / Mercado Pago Split)
- PostgreSQL em produção
- Notificações por e-mail
- Avaliações de psicólogos
- Conformidade LGPD

## Licença

Uso livre para fins pessoais ou profissionais.
