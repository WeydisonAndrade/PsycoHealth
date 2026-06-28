import { z } from "zod";

export const bookAppointmentSchema = z.object({
  psychologistId: z.string().min(1),
  scheduledAt: z.string().min(1, "Horário obrigatório"),
});

export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;

export interface TimeSlot {
  datetime: string;
  available: boolean;
}
