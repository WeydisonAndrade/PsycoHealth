"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency } from "@/lib/utils";
import { PLATFORM_COMMISSION_RATE } from "@/domain/payment";

interface PaymentSummaryProps {
  appointmentId: string;
  totalAmount: number;
  platformCommission: number;
  psychologistPayout: number;
  psychologistName: string;
}

export function PaymentCheckout({
  appointmentId,
  totalAmount,
  platformCommission,
  psychologistPayout,
  psychologistName,
}: PaymentSummaryProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/payments/${appointmentId}`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro no pagamento");
        return;
      }

      router.push("/dashboard/patient");
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Pagamento da consulta" subtitle={`Consulta com ${psychologistName}`}>
      {error && <Alert type="error">{error}</Alert>}

      <Alert type="info">
        MVP: pagamento simulado. Em produção, integre Stripe ou Mercado Pago.
      </Alert>

      <div className="mt-2">
        <div className="split-row">
          <span>Valor da sessão</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
        <div className="split-row">
          <span>Comissão da plataforma ({PLATFORM_COMMISSION_RATE * 100}%)</span>
          <span>{formatCurrency(platformCommission)}</span>
        </div>
        <div className="split-row">
          <span>Repasse ao psicólogo</span>
          <span>{formatCurrency(psychologistPayout)}</span>
        </div>
        <div className="split-row">
          <span>Total a pagar</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <Button className="mt-3" fullWidth onClick={handlePay} disabled={loading}>
        {loading ? "Processando..." : "Confirmar pagamento"}
      </Button>
    </Card>
  );
}
