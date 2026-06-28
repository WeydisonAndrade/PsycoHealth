/** Barrel export — domínio do psicólogo (perfil, listagem, ganhos). */
export { updateProfileSchema, setAvailabilitySchema } from "./schemas";
export type { UpdateProfileInput, SetAvailabilityInput } from "./schemas";
export {
  listPsychologists,
  getPublicProfile,
  getProfileByUserId,
  updateProfile,
  setAvailability,
  getPsychologistEarnings,
} from "./service";
