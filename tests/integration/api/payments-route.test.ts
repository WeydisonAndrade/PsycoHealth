import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/domain/scheduling", () => ({
  getAppointmentById: vi.fn(),
}));

vi.mock("@/domain/payment", () => ({
  getPaymentSummary: vi.fn(),
  processPayment: vi.fn(),
}));

import { getSession } from "@/lib/session";
import { getAppointmentById } from "@/domain/scheduling";
import { getPaymentSummary } from "@/domain/payment";
import { GET } from "@/app/api/payments/[appointmentId]/route";

const mockedGetSession = vi.mocked(getSession);
const mockedGetAppointment = vi.mocked(getAppointmentById);
const mockedGetPaymentSummary = vi.mocked(getPaymentSummary);

describe("GET /api/payments/[appointmentId] — segurança", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna 401 sem sessão", async () => {
    mockedGetSession.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/payments/a1"), {
      params: Promise.resolve({ appointmentId: "a1" }),
    });

    expect(response.status).toBe(401);
  });

  it("retorna 403 quando paciente tenta acessar pagamento de outro", async () => {
    mockedGetSession.mockResolvedValue({
      userId: "patient-a",
      email: "a@test.com",
      name: "Paciente A",
      role: "PATIENT",
    });

    mockedGetAppointment.mockResolvedValue({
      id: "appointment-1",
      patient: { user: { id: "patient-b", name: "Paciente B" } },
      psychologist: { user: { id: "psy-1", name: "Psicólogo" } },
    } as Awaited<ReturnType<typeof getAppointmentById>>);

    const response = await GET(new Request("http://localhost/api/payments/appointment-1"), {
      params: Promise.resolve({ appointmentId: "appointment-1" }),
    });

    expect(response.status).toBe(403);
    expect(mockedGetPaymentSummary).not.toHaveBeenCalled();
  });

  it("retorna pagamento quando paciente é dono da consulta", async () => {
    mockedGetSession.mockResolvedValue({
      userId: "patient-a",
      email: "a@test.com",
      name: "Paciente A",
      role: "PATIENT",
    });

    mockedGetAppointment.mockResolvedValue({
      id: "appointment-1",
      patient: { user: { id: "patient-a", name: "Paciente A" } },
      psychologist: { user: { id: "psy-1", name: "Psicólogo" } },
    } as Awaited<ReturnType<typeof getAppointmentById>>);

    mockedGetPaymentSummary.mockResolvedValue({
      id: "pay-1",
      totalAmount: 200,
      platformCommission: 40,
      psychologistPayout: 160,
      commissionRate: 0.2,
      status: "PENDING",
      appointmentId: "appointment-1",
      paidAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      split: {
        totalAmount: 200,
        platformCommission: 40,
        psychologistPayout: 160,
        commissionRate: 0.2,
      },
    } as Awaited<ReturnType<typeof getPaymentSummary>>);

    const response = await GET(new Request("http://localhost/api/payments/appointment-1"), {
      params: Promise.resolve({ appointmentId: "appointment-1" }),
    });

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.payment.totalAmount).toBe(200);
  });

  it("retorna 403 para psicólogo tentando acessar endpoint de paciente", async () => {
    mockedGetSession.mockResolvedValue({
      userId: "psy-1",
      email: "psy@test.com",
      name: "Psicólogo",
      role: "PSYCHOLOGIST",
    });

    const response = await GET(new Request("http://localhost/api/payments/appointment-1"), {
      params: Promise.resolve({ appointmentId: "appointment-1" }),
    });

    expect(response.status).toBe(403);
    expect(response).toBeInstanceOf(NextResponse);
  });
});
