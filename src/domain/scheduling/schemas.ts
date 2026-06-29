/**
 * Schemas Zod — agendamento de consultas.
 */

import { z } from "zod";

/** Payload para reservar um horário com um psicólogo */
export const bookAppointmentSchema = z.object({
  psychologistId: z.string().min(1),
  scheduledAt: z.string().min(1, "Horário obrigatório"), // ISO 8601
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

/** Slot retornado pela API de disponibilidade */
export interface TimeSlot {
  datetime: string;
  available: boolean;
}

/** Slot enriquecido para o calendário (livre ou ocupado) */
export interface CalendarSlot {
  datetime: string;
  available: boolean;
  label?: string;
  appointmentId?: string;
}

/** Consulta do paciente exibida no calendário */
export interface CalendarEvent {
  datetime: string;
  label: string;
  appointmentId: string;
  status: string;
}
