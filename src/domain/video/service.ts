import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

const JITSI_BASE = "https://meet.jit.si";

export function buildRoomId(appointmentId: string): string {
  return `PsycoHealth-${appointmentId}`;
}

export function buildJitsiUrl(roomId: string): string {
  return `${JITSI_BASE}/${roomId}`;
}

export async function createVideoRoom(appointmentId: string) {
  const existing = await prisma.videoSession.findUnique({
    where: { appointmentId },
  });
  if (existing) return existing;

  const roomId = buildRoomId(appointmentId);

  return prisma.videoSession.create({
    data: { appointmentId, roomId },
  });
}

export async function canJoinRoom(appointmentId: string, userId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      payment: true,
      videoSession: true,
      psychologist: { include: { user: true } },
      patient: { include: { user: true } },
    },
  });

  if (!appointment) {
    return { allowed: false, reason: "Consulta não encontrada" };
  }

  const isParticipant =
    appointment.psychologist.user.id === userId ||
    appointment.patient.user.id === userId;

  if (!isParticipant) {
    return { allowed: false, reason: "Você não participa desta consulta" };
  }

  if (appointment.payment?.status !== "PAID") {
    return { allowed: false, reason: "Pagamento pendente" };
  }

  if (
    appointment.status !== AppointmentStatus.CONFIRMED &&
    appointment.status !== AppointmentStatus.IN_PROGRESS &&
    appointment.status !== AppointmentStatus.COMPLETED
  ) {
    return { allowed: false, reason: "Consulta não confirmada" };
  }

  const now = new Date();
  const sessionStart = new Date(appointment.scheduledAt);
  const windowStart = new Date(sessionStart.getTime() - 15 * 60 * 1000);
  const windowEnd = new Date(
    sessionStart.getTime() + appointment.durationMin * 60 * 1000 + 30 * 60 * 1000
  );

  if (now < windowStart) {
    return { allowed: false, reason: "Sala disponível 15 minutos antes da consulta" };
  }
  if (now > windowEnd) {
    return { allowed: false, reason: "Janela da consulta encerrada" };
  }

  let videoSession = appointment.videoSession;
  if (!videoSession) {
    videoSession = await createVideoRoom(appointmentId);
  }

  if (appointment.status === AppointmentStatus.CONFIRMED) {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.IN_PROGRESS },
    });
    await prisma.videoSession.update({
      where: { id: videoSession.id },
      data: { startedAt: new Date() },
    });
  }

  return {
    allowed: true,
    roomId: videoSession.roomId,
    jitsiUrl: buildJitsiUrl(videoSession.roomId),
  };
}

export async function endVideoSession(appointmentId: string, userId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      videoSession: true,
      psychologist: { include: { user: true } },
      patient: { include: { user: true } },
    },
  });

  if (!appointment?.videoSession) throw new Error("Sessão não encontrada");

  const isParticipant =
    appointment.psychologist.user.id === userId ||
    appointment.patient.user.id === userId;
  if (!isParticipant) throw new Error("Sem permissão");

  await prisma.$transaction([
    prisma.videoSession.update({
      where: { id: appointment.videoSession.id },
      data: { endedAt: new Date() },
    }),
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.COMPLETED },
    }),
  ]);
}
