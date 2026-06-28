export { loginSchema, registerPatientSchema, registerPsychologistSchema } from "./schemas";
export type { LoginInput, RegisterPatientInput, RegisterPsychologistInput } from "./schemas";
export { AuthError, login, registerPatient, registerPsychologist } from "./service";
