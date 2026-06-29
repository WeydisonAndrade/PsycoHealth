/** Barrel export — domínio de agendamento (slots, reserva, cancelamento). */
export { bookAppointmentSchema } from "./schemas";
export type { BookAppointmentInput, TimeSlot, CalendarSlot, CalendarEvent } from "./schemas";
export {
  getAvailableSlots,
  getCalendarSlots,
  getPatientCalendarEvents,
  buildPatientPreview,
  bookAppointment,
  getAppointmentById,
  getPatientAppointments,
  getPsychologistAppointments,
  cancelAppointment,
} from "./service";
