/**
 * Utilitários compartilhados entre domínio, componentes e páginas.
 */

/** Formata número como moeda brasileira (R$) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Formata data/hora para exibição em português */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

/** Converte JSON de especialidades (string do banco) para array */
export function parseSpecialties(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Serializa array de especialidades para gravar no SQLite */
export function stringifySpecialties(specialties: string[]): string {
  return JSON.stringify(specialties);
}

/** Labels dos dias da semana — índice 0 = Domingo (Date.getDay()) */
export const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

/** Opções fixas de especialidade no cadastro e edição de perfil */
export const SPECIALTY_OPTIONS = [
  "Ansiedade",
  "Depressão",
  "Burnout",
  "Síndrome do Pânico",
  "Estresse",
  "Baixa Autoestima",
  "Problemas de Relacionamento",
  "Terapia de Casal",
  "LGBTQIA+",
];
