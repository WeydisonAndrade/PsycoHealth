import { describe, expect, it } from "vitest";
import { calculateSplit, PLATFORM_COMMISSION_RATE } from "@/domain/payment/commission";

describe("calculateSplit", () => {
  it("aplica comissão de 20% e repassa 80% ao psicólogo", () => {
    const split = calculateSplit(200);

    expect(split.commissionRate).toBe(PLATFORM_COMMISSION_RATE);
    expect(split.platformCommission).toBe(40);
    expect(split.psychologistPayout).toBe(160);
    expect(split.totalAmount).toBe(200);
  });

  it("mantém a soma de comissão e repasse igual ao total", () => {
    const split = calculateSplit(150);

    expect(split.platformCommission + split.psychologistPayout).toBe(split.totalAmount);
  });

  it("arredonda centavos corretamente", () => {
    const split = calculateSplit(99.99);

    expect(split.platformCommission).toBe(20);
    expect(split.psychologistPayout).toBe(79.99);
  });

  it("retorna zero para valor zero", () => {
    const split = calculateSplit(0);

    expect(split.platformCommission).toBe(0);
    expect(split.psychologistPayout).toBe(0);
  });
});
