/**
 * Formulário de cadastro de paciente (nome, e-mail, telefone e senha).
 * Usado em src/app/register/patient/page.tsx; redireciona para /dashboard/patient após sucesso.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { resolvePostAuthPath } from "@/lib/auth-routes";

interface RegisterPatientFormProps {
  redirectTo?: string;
}

export function RegisterPatientForm({ redirectTo }: RegisterPatientFormProps) {
  /* --- Estado e hooks --- */
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* --- Handlers de eventos --- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao cadastrar");
        return;
      }

      router.push(resolvePostAuthPath("PATIENT", redirectTo));
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  /* --- Renderização --- */
  return (
    <Card title="Cadastro de Paciente" subtitle="Crie sua conta para agendar consultas" className="auth-card">
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Telefone (opcional)"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Cadastrando..." : "Criar conta"}
        </Button>
      </form>
      <div className="auth-links">
        <p>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
        <p className="mt-1">
          É psicólogo? <Link href="/register/psychologist">Cadastre-se aqui</Link>
        </p>
      </div>
    </Card>
  );
}
