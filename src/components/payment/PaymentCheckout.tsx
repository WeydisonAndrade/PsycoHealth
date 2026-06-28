/**
 * Checkout de pagamento simulado.
 * Usado em src/app/appointments/[id]/payment/page.tsx; confirma via POST /api/payments/:id.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { formatCurrency } from "@/lib/utils";
interface PaymentSummaryProps {
  appointmentId: string;
  totalAmount: number;
  psychologistName: string;
}

export function PaymentCheckout({
  appointmentId,
  totalAmount,
  psychologistName,
}: PaymentSummaryProps) {
  /* --- Estado e hooks --- */
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* --- Handlers de eventos --- */
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

  /* --- Renderização --- */
  return (
    <Card title="Pagamento da consulta" subtitle={`Consulta com ${psychologistName}`}>
      {error && <Alert type="error">{error}</Alert>}

      <Alert type="info">
        MVP: pagamento simulado. Em produção, integre Stripe ou Mercado Pago.
      </Alert>

      <div className="mt-2">
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
