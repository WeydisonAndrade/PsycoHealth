import { describe, expect, it } from "vitest";
import { parseSpecialties, stringifySpecialties } from "@/lib/utils";

describe("parseSpecialties", () => {
  it("converte JSON válido em array", () => {
    expect(parseSpecialties('["Ansiedade","Depressão"]')).toEqual([
      "Ansiedade",
      "Depressão",
    ]);
  });

  it("retorna array vazio para JSON inválido", () => {
    expect(parseSpecialties("não é json")).toEqual([]);
  });

  it("retorna array vazio quando JSON não é array", () => {
    expect(parseSpecialties('{"especialidade":"Ansiedade"}')).toEqual([]);
  });
});

describe("stringifySpecialties", () => {
  it("serializa array para JSON", () => {
    expect(stringifySpecialties(["Ansiedade"])).toBe('["Ansiedade"]');
  });
});
