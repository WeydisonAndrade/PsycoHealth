import { z } from "zod";

export const updateProfileSchema = z.object({
  bio: z.string().max(2000).optional(),
  specialties: z.array(z.string()).optional(),
  sessionPrice: z.number().min(50).optional(),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const setAvailabilitySchema = z.object({
  slots: z.array(availabilitySlotSchema),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SetAvailabilityInput = z.infer<typeof setAvailabilitySchema>;
