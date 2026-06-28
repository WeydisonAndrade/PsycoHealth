import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { AuthError } from "@/domain/auth";
import { mapAuthRouteError } from "@/lib/http-errors";

describe("mapAuthRouteError", () => {
  it("mapeia credenciais inválidas para 401", () => {
    const result = mapAuthRouteError(new AuthError("E-mail ou senha incorretos"));

    expect(result).toEqual({
      message: "E-mail ou senha incorretos",
      status: 401,
    });
  });

  it("mapeia e-mail duplicado para 409", () => {
    const result = mapAuthRouteError(new AuthError("E-mail já cadastrado", "EMAIL_EXISTS"));

    expect(result).toEqual({
      message: "E-mail já cadastrado",
      status: 409,
    });
  });

  it("mapeia ZodError para 400", () => {
    const zodError = new ZodError([]);
    const result = mapAuthRouteError(zodError);

    expect(result).toEqual({
      message: "Dados inválidos",
      status: 400,
    });
  });

  it("retorna null para erros desconhecidos", () => {
    expect(mapAuthRouteError(new Error("falha inesperada"))).toBeNull();
  });
});
