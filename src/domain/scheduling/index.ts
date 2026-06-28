/** Barrel export — domínio de agendamento (slots, reserva, cancelamento). */
export { bookAppointmentSchema } from "./schemas";
export type { BookAppointmentInput, TimeSlot } from "./schemas";
export {
  getAvailableSlots,
  bookAppointment,
  getAppointmentById,
  getPatientAppointments,
  getPsychologistAppointments,
  cancelAppointment,
} from "./service";
