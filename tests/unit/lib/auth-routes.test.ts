import { describe, expect, it } from "vitest";
import {
  getDashboardPath,
  getLoginPath,
  isSafeRedirectPath,
  resolvePostAuthPath,
} from "@/lib/auth-routes";

describe("auth-routes", () => {
  it("retorna dashboard correto por papel", () => {
    expect(getDashboardPath("PATIENT")).toBe("/dashboard/patient");
    expect(getDashboardPath("PSYCHOLOGIST")).toBe("/dashboard/psychologist");
  });

  it("monta login com next seguro", () => {
    expect(getLoginPath("/psychologists/abc/book")).toBe(
      "/login?next=%2Fpsychologists%2Fabc%2Fbook"
    );
  });

  it("rejeita next externo inseguro", () => {
    expect(getLoginPath("https://evil.com")).toBe("/login");
    expect(getLoginPath("//evil.com")).toBe("/login");
  });

  it("resolve destino pós-auth com next válido", () => {
    expect(resolvePostAuthPath("PATIENT", "/psychologists/1/book")).toBe(
      "/psychologists/1/book"
    );
  });

  it("resolve destino pós-auth sem next para dashboard", () => {
    expect(resolvePostAuthPath("PATIENT", null)).toBe("/dashboard/patient");
  });

  it("valida paths internos", () => {
    expect(isSafeRedirectPath("/dashboard/patient")).toBe(true);
    expect(isSafeRedirectPath("http://x.com")).toBe(false);
  });
});
