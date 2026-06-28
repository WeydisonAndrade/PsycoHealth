import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerPatientSchema,
  registerPsychologistSchema,
} from "@/domain/auth/schemas";

describe("loginSchema", () => {
  it("aceita credenciais válidas", () => {
    const result = loginSchema.safeParse({
      email: "paciente@psycohealth.com",
      password: "senha123",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({
      email: "invalido",
      password: "senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha curta", () => {
    const result = loginSchema.safeParse({
      email: "paciente@psycohealth.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerPatientSchema", () => {
  it("aceita cadastro mínimo válido", () => {
    const result = registerPatientSchema.safeParse({
      name: "Maria Silva",
      email: "maria@example.com",
      password: "senha123",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = registerPatientSchema.safeParse({
      name: "A",
      email: "maria@example.com",
      password: "senha123",
    });

    expect(result.success).toBe(false);
  });
});

describe("registerPsychologistSchema", () => {
  it("aceita cadastro completo válido", () => {
    const result = registerPsychologistSchema.safeParse({
      name: "Dr. João",
      email: "joao@example.com",
      password: "senha123",
      crp: "06/123456",
      specialties: ["Ansiedade"],
      sessionPrice: 150,
    });

    expect(result.success).toBe(true);
  });

  it("rejeita valor de sessão abaixo do mínimo", () => {
    const result = registerPsychologistSchema.safeParse({
      name: "Dr. João",
      email: "joao@example.com",
      password: "senha123",
      crp: "06/123456",
      specialties: ["Ansiedade"],
      sessionPrice: 30,
    });

    expect(result.success).toBe(false);
  });

  it("exige ao menos uma especialidade", () => {
    const result = registerPsychologistSchema.safeParse({
      name: "Dr. João",
      email: "joao@example.com",
      password: "senha123",
      crp: "06/123456",
      specialties: [],
      sessionPrice: 150,
    });

    expect(result.success).toBe(false);
  });
});
