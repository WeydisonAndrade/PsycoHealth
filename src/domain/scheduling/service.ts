/**
 * Domínio: Agendamento
 * Calcula slots livres, reserva consultas e gerencia cancelamentos.
 */

import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createPaymentForAppointment } from "@/domain/payment";
import type { BookAppointmentInput } from "./schemas";

/** Converte relato da consulta ou perfil em texto para preview do psicólogo */
export function buildPatientPreview(
  appointmentNotes: string | null | undefined,
  profileConcerns: string | null | undefined
): string {
  return appointmentNotes?.trim() || profileConcerns?.trim() || "";
}

/** Duração padrão de cada sessão em minutos */
const SESSION_DURATION_MIN = 50;

/** Converte "HH:mm" em horas e minutos numéricos */
function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

/**
 * Verifica se a data/hora escolhida cabe dentro de algum slot
 * de disponibilidade do psicólogo (considerando duração da sessão).
 */
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

/**
 * Gera slots de 50 min nos próximos N dias com base na grade semanal.
 * Horários reservados aparecem como indisponíveis (label opcional com nome do paciente).
 */
export async function getCalendarSlots(
  psychologistId: string,
  fromDate: Date,
  days = 14,
  options?: { includeBookingDetails?: boolean }
): Promise<import("./schemas").CalendarSlot[]> {
  const profile = await prisma.psychologistProfile.findUnique({
    where: { id: psychologistId },
    include: { availability: true },
  });

  if (!profile || profile.availability.length === 0) return [];

  const slots: { datetime: string; available: boolean }[] = [];
  const now = new Date();
  const rangeEnd = new Date(fromDate);
  rangeEnd.setDate(rangeEnd.getDate() + days);

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
      scheduledAt: { gte: fromDate, lt: rangeEnd },
      status: { notIn: ["CANCELLED"] },
    },
    select: {
      id: true,
      scheduledAt: true,
      notes: true,
      patient: {
        select: {
          concerns: true,
          user: { select: { name: true } },
        },
      },
    },
  });

  const bookedMap = new Map(
    existing.map((a) => [a.scheduledAt.toISOString(), a] as const)
  );

  return slots.map((s) => {
    const booked = bookedMap.get(s.datetime);
    if (booked) {
      const preview = options?.includeBookingDetails
        ? buildPatientPreview(booked.notes, booked.patient.concerns)
        : "";
      return {
        datetime: s.datetime,
        available: false,
        label: options?.includeBookingDetails
          ? booked.patient.user.name
          : "Ocupado",
        appointmentId: booked.id,
        patientConcerns: preview || undefined,
      };
    }
    return s;
  });
}

/** Retorna slots livres/ocupados (sem dados sensíveis do paciente) */
export async function getAvailableSlots(
  psychologistId: string,
  fromDate: Date,
  days = 14
): Promise<{ datetime: string; available: boolean }[]> {
  const slots = await getCalendarSlots(psychologistId, fromDate, days);
  return slots.map(({ datetime, available }) => ({ datetime, available }));
}

/** Consultas do paciente para exibir no calendário */
export async function getPatientCalendarEvents(
  patientUserId: string,
  fromDate: Date,
  days = 42
): Promise<import("./schemas").CalendarEvent[]> {
  const patient = await prisma.patientProfile.findUnique({
    where: { userId: patientUserId },
  });
  if (!patient) return [];

  const rangeEnd = new Date(fromDate);
  rangeEnd.setDate(rangeEnd.getDate() + days);

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      scheduledAt: { gte: fromDate, lt: rangeEnd },
      status: { notIn: ["CANCELLED"] },
    },
    include: {
      psychologist: { include: { user: { select: { name: true } } } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return appointments.map((a) => ({
    datetime: a.scheduledAt.toISOString(),
    label: a.psychologist.user.name,
    appointmentId: a.id,
    status: a.status,
  }));
}

/**
 * Reserva consulta: valida disponibilidade, cria Appointment e Payment pendente.
 */
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

  // Evita double-booking no mesmo horário
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

  const concerns = input.concerns?.trim();

  const appointment = await prisma.appointment.create({
    data: {
      psychologistId: input.psychologistId,
      patientId: patient.id,
      scheduledAt,
      durationMin: SESSION_DURATION_MIN,
      status: AppointmentStatus.PENDING_PAYMENT,
      notes: concerns || undefined,
    },
    include: {
      psychologist: { include: { user: { select: { name: true } } } },
      patient: { include: { user: { select: { name: true } } } },
    },
  });

  if (concerns) {
    await prisma.patientProfile.update({
      where: { id: patient.id },
      data: { concerns },
    });
  }

  // Cria registro de pagamento com split 80/20
  const payment = await createPaymentForAppointment(
    appointment.id,
    psychologist.sessionPrice
  );

  return { appointment, payment };
}

/** Busca consulta com participantes, pagamento e sessão de vídeo */
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

/** Histórico de consultas do paciente logado */
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

/** Histórico de consultas do psicólogo logado */
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

/** Cancelamento — permitido apenas a participantes e antes de IN_PROGRESS/COMPLETED */
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
