/**
 * Domínio: Autenticação
 * Regras de cadastro (paciente/psicólogo), login e geração de sessão JWT.
 */

import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/session";
import { stringifySpecialties } from "@/lib/utils";
import type {
  LoginInput,
  RegisterPatientInput,
  RegisterPsychologistInput,
} from "./schemas";

/** Erro de negócio com código para mapear status HTTP na API */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: "INVALID_CREDENTIALS" | "EMAIL_EXISTS" | "CRP_EXISTS" = "INVALID_CREDENTIALS"
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Cadastra paciente: User + PatientProfile + sessão automática.
 */
export async function registerPatient(input: RegisterPatientInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AuthError("E-mail já cadastrado", "EMAIL_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: UserRole.PATIENT,
      patientProfile: {
        create: { phone: input.phone },
      },
    },
    include: { patientProfile: true },
  });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token };
}

/**
 * Cadastra psicólogo: valida CRP único, cria perfil profissional e sessão.
 */
export async function registerPsychologist(input: RegisterPsychologistInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) {
    throw new AuthError("E-mail já cadastrado", "EMAIL_EXISTS");
  }

  const existingCrp = await prisma.psychologistProfile.findUnique({
    where: { crp: input.crp },
  });
  if (existingCrp) {
    throw new AuthError("CRP já cadastrado", "CRP_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
      role: UserRole.PSYCHOLOGIST,
      psychologistProfile: {
        create: {
          crp: input.crp,
          bio: input.bio ?? "",
          specialties: stringifySpecialties(input.specialties),
          sessionPrice: input.sessionPrice,
        },
      },
    },
    include: { psychologistProfile: true },
  });

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token };
}

/**
 * Autentica por e-mail/senha e retorna usuário + token JWT.
 */
export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: {
      psychologistProfile: true,
      patientProfile: true,
    },
  });

  if (!user) {
    throw new AuthError("E-mail ou senha incorretos");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AuthError("E-mail ou senha incorretos");
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return { user, token };
}
