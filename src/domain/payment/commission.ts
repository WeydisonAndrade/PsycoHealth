/**
 * Regra de negócio: comissão automática da plataforma.
 * A cada pagamento, 20% fica com a PsycoHealth e 80% vai ao psicólogo.
 */

/** Taxa fixa de comissão (20%) — alterar aqui afeta todo o sistema */
export const PLATFORM_COMMISSION_RATE = 0.2;

/** Resultado do split financeiro de uma consulta */
export interface PaymentSplit {
  totalAmount: number;
  platformCommission: number;
  psychologistPayout: number;
  commissionRate: number;
}

/**
 * Calcula repasse plataforma/psicólogo a partir do valor total da sessão.
 * Arredonda centavos para evitar imprecisão de ponto flutuante.
 */
export function calculateSplit(totalAmount: number): PaymentSplit {
  const platformCommission = Math.round(totalAmount * PLATFORM_COMMISSION_RATE * 100) / 100;
  const psychologistPayout = Math.round((totalAmount - platformCommission) * 100) / 100;

  return {
    totalAmount,
    platformCommission,
    psychologistPayout,
    commissionRate: PLATFORM_COMMISSION_RATE,
  };
}
