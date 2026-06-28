import { PaymentStatus, AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { calculateSplit } from "./commission";
import { createVideoRoom } from "@/domain/video";

export async function createPaymentForAppointment(
  appointmentId: string,
  totalAmount: number
) {
  const split = calculateSplit(totalAmount);

  return prisma.payment.create({
    data: {
      appointmentId,
      totalAmount: split.totalAmount,
      platformCommission: split.platformCommission,
      psychologistPayout: split.psychologistPayout,
      commissionRate: split.commissionRate,
      status: PaymentStatus.PENDING,
    },
  });
}

export async function getPaymentByAppointmentId(appointmentId: string) {
  return prisma.payment.findUnique({
    where: { appointmentId },
    include: { appointment: true },
  });
}

/**
 * Simula confirmação de pagamento (MVP).
 * Em produção, substituir por webhook do gateway (Stripe, Mercado Pago, etc.).
 */
export async function processPayment(appointmentId: string, patientUserId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      payment: true,
      patient: { include: { user: true } },
    },
  });

  if (!appointment) throw new Error("Consulta não encontrada");
  if (appointment.patient.user.id !== patientUserId) {
    throw new Error("Sem permissão");
  }
  if (!appointment.payment) throw new Error("Pagamento não encontrado");
  if (appointment.payment.status === PaymentStatus.PAID) {
    return appointment.payment;
  }

  const [payment] = await prisma.$transaction([
    prisma.payment.update({
      where: { id: appointment.payment.id },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CONFIRMED },
    }),
  ]);

  await createVideoRoom(appointmentId);

  return payment;
}

export async function getPaymentSummary(appointmentId: string) {
  const payment = await getPaymentByAppointmentId(appointmentId);
  if (!payment) return null;

  return {
    ...payment,
    split: calculateSplit(payment.totalAmount),
  };
}
