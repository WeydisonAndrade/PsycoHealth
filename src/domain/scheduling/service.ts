import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createPaymentForAppointment } from "@/domain/payment";
import type { BookAppointmentInput } from "./schemas";

const SESSION_DURATION_MIN = 50;

function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

function isWithinAvailability(
  date: Date,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
): boolean {
  const dayOfWeek = date.getDay();
  const daySlots = slots.filter((s) => s.dayOfWeek === dayOfWeek);
  if (daySlots.length === 0) return false;

  const timeMinutes = date.getHours() * 60 + date.getMinutes();

  return daySlots.some((slot) => {
    const start = parseTime(slot.startTime);
    const end = parseTime(slot.endTime);
    const startMin = start.hours * 60 + start.minutes;
    const endMin = end.hours * 60 + end.minutes;
    return timeMinutes >= startMin && timeMinutes + SESSION_DURATION_MIN <= endMin;
  });
}

export async function getAvailableSlots(
  psychologistId: string,
  fromDate: Date,
  days = 14
): Promise<{ datetime: string; available: boolean }[]> {
  const profile = await prisma.psychologistProfile.findUnique({
    where: { id: psychologistId },
    include: { availability: true },
  });

  if (!profile || profile.availability.length === 0) return [];

  const slots: { datetime: string; available: boolean }[] = [];
  const now = new Date();

  for (let d = 0; d < days; d++) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + d);
    date.setHours(0, 0, 0, 0);

    const daySlots = profile.availability.filter((s) => s.dayOfWeek === date.getDay());

    for (const avail of daySlots) {
      const { hours: startH, minutes: startM } = parseTime(avail.startTime);
      const { hours: endH, minutes: endM } = parseTime(avail.endTime);

      let cursor = new Date(date);
      cursor.setHours(startH, startM, 0, 0);

      const end = new Date(date);
      end.setHours(endH, endM, 0, 0);

      while (cursor.getTime() + SESSION_DURATION_MIN * 60 * 1000 <= end.getTime()) {
        if (cursor > now) {
          slots.push({
            datetime: cursor.toISOString(),
            available: true,
          });
        }
        cursor = new Date(cursor.getTime() + SESSION_DURATION_MIN * 60 * 1000);
      }
    }
  }

  const existing = await prisma.appointment.findMany({
    where: {
      psychologistId,
      scheduledAt: { gte: fromDate },
      status: { notIn: ["CANCELLED"] },
    },
    select: { scheduledAt: true },
  });

  const bookedSet = new Set(existing.map((a) => a.scheduledAt.toISOString()));

  return slots.map((s) => ({
    ...s,
    available: s.available && !bookedSet.has(s.datetime),
  }));
}

export async function bookAppointment(patientUserId: string, input: BookAppointmentInput) {
  const patient = await prisma.patientProfile.findUnique({
    where: { userId: patientUserId },
  });
  if (!patient) throw new Error("Perfil de paciente não encontrado");

  const psychologist = await prisma.psychologistProfile.findUnique({
    where: { id: input.psychologistId },
    include: { availability: true },
  });
  if (!psychologist || !psychologist.isActive) {
    throw new Error("Psicólogo não encontrado");
  }

  const scheduledAt = new Date(input.scheduledAt);
  if (scheduledAt <= new Date()) {
    throw new Error("Horário deve ser no futuro");
  }

  if (!isWithinAvailability(scheduledAt, psychologist.availability)) {
    throw new Error("Horário fora da disponibilidade do psicólogo");
  }

  const conflict = await prisma.appointment.findFirst({
    where: {
      psychologistId: input.psychologistId,
      scheduledAt,
      status: { notIn: ["CANCELLED"] },
    },
  });
  if (conflict) {
    throw new Error("Horário já reservado");
  }

  const appointment = await prisma.appointment.create({
    data: {
      psychologistId: input.psychologistId,
      patientId: patient.id,
      scheduledAt,
      durationMin: SESSION_DURATION_MIN,
      status: AppointmentStatus.PENDING_PAYMENT,
    },
    include: {
      psychologist: { include: { user: { select: { name: true } } } },
      patient: { include: { user: { select: { name: true } } } },
    },
  });

  const payment = await createPaymentForAppointment(
    appointment.id,
    psychologist.sessionPrice
  );

  return { appointment, payment };
}

export async function getAppointmentById(appointmentId: string) {
  return prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      psychologist: { include: { user: { select: { id: true, name: true } } } },
      patient: { include: { user: { select: { id: true, name: true } } } },
      payment: true,
      videoSession: true,
    },
  });
}

export async function getPatientAppointments(patientUserId: string) {
  const patient = await prisma.patientProfile.findUnique({
    where: { userId: patientUserId },
  });
  if (!patient) return [];

  return prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: {
      psychologist: { include: { user: { select: { name: true } } } },
      payment: true,
      videoSession: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
}

export async function getPsychologistAppointments(psychologistUserId: string) {
  const profile = await prisma.psychologistProfile.findUnique({
    where: { userId: psychologistUserId },
  });
  if (!profile) return [];

  return prisma.appointment.findMany({
    where: { psychologistId: profile.id },
    include: {
      patient: { include: { user: { select: { name: true } } } },
      payment: true,
      videoSession: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
}

export async function cancelAppointment(appointmentId: string, userId: string) {
  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) throw new Error("Consulta não encontrada");

  const isPatient = appointment.patient.user.id === userId;
  const isPsychologist = appointment.psychologist.user.id === userId;
  if (!isPatient && !isPsychologist) {
    throw new Error("Sem permissão para cancelar");
  }

  if (appointment.status === "COMPLETED" || appointment.status === "IN_PROGRESS") {
    throw new Error("Consulta não pode ser cancelada");
  }

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: AppointmentStatus.CANCELLED },
  });
}
