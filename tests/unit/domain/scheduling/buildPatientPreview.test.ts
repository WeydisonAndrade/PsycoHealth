import { describe, expect, it } from "vitest";
import { buildPatientPreview } from "@/domain/scheduling/service";

describe("buildPatientPreview", () => {
  it("prioriza notas da consulta sobre o perfil", () => {
    expect(buildPatientPreview("Crise de pânico recente", "Ansiedade geral")).toBe(
      "Crise de pânico recente"
    );
  });

  it("usa concerns do perfil quando não há notas", () => {
    expect(buildPatientPreview(null, "Insônia e estresse")).toBe("Insônia e estresse");
  });

  it("retorna vazio quando não há relato", () => {
    expect(buildPatientPreview("", "  ")).toBe("");
  });
});
