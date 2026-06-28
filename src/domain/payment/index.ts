/** Barrel export — domínio de pagamento (split 20%, checkout simulado). */
export { PLATFORM_COMMISSION_RATE, calculateSplit } from "./commission";
export type { PaymentSplit } from "./commission";
export {
  createPaymentForAppointment,
  getPaymentByAppointmentId,
  processPayment,
  getPaymentSummary,
} from "./service";
