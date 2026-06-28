/** Comissão automática da plataforma: 20% */
export const PLATFORM_COMMISSION_RATE = 0.2;

export interface PaymentSplit {
  totalAmount: number;
  platformCommission: number;
  psychologistPayout: number;
  commissionRate: number;
}

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
