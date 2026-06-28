import { describe, expect, it } from "vitest";
import { buildJitsiUrl, buildRoomId } from "@/domain/video/service";

describe("video room helpers", () => {
  it("gera roomId vinculado à consulta", () => {
    expect(buildRoomId("abc-123")).toBe("PsycoHealth-abc-123");
  });

  it("monta URL do Jitsi com roomId", () => {
    const roomId = buildRoomId("consulta-1");
    expect(buildJitsiUrl(roomId)).toBe(`https://meet.jit.si/${roomId}`);
  });

  it("não inclui caracteres arbitrários no prefixo da sala", () => {
    expect(buildRoomId("x")).toMatch(/^PsycoHealth-/);
  });
});
