import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/session";

describe("session JWT", () => {
  const payload = {
    userId: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "PATIENT" as const,
  };

  it("cria e valida token com payload correto", async () => {
    const token = await createSessionToken(payload);
    const decoded = await verifySessionToken(token);

    expect(decoded).toMatchObject(payload);
  });

  it("rejeita token adulterado", async () => {
    const token = await createSessionToken(payload);
    const decoded = await verifySessionToken(`${token}x`);

    expect(decoded).toBeNull();
  });

  it("rejeita token vazio", async () => {
    expect(await verifySessionToken("")).toBeNull();
  });
});
