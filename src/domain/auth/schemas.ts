/**
 * Schemas Zod — validação de entrada para autenticação.
 * Usados nas API routes antes de chamar o service.
 */

import { z } from "zod";

/** Credenciais de login */
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

/** Dados do formulário de cadastro de paciente */
export const registerPatientSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().optional(),
});

/** Dados do formulário de cadastro de psicólogo (inclui CRP e especialidades) */
export const registerPsychologistSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  crp: z.string().min(4, "CRP obrigatório"),
  bio: z.string().optional(),
  specialties: z.array(z.string()).min(1, "Selecione ao menos uma especialidade"),
  sessionPrice: z.number().min(50, "Valor mínimo R$ 50"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;
export type RegisterPsychologistInput = z.infer<typeof registerPsychologistSchema>;
