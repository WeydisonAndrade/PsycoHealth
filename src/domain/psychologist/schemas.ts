/**
 * Schemas Zod — perfil e disponibilidade do psicólogo.
 */

import { z } from "zod";

/** Campos editáveis no dashboard do psicólogo */
export const updateProfileSchema = z.object({
  bio: z.string().max(2000).optional(),
  specialties: z.array(z.string()).optional(),
  sessionPrice: z.number().min(50).optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

/** Um bloco de horário na grade semanal */
export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

/** Lista completa de slots — substitui a disponibilidade anterior */
export const setAvailabilitySchema = z.object({
  slots: z.array(availabilitySlotSchema),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
