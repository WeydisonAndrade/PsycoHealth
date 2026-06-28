export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

export function parseSpecialties(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function stringifySpecialties(specialties: string[]): string {
  return JSON.stringify(specialties);
}

export const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

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
