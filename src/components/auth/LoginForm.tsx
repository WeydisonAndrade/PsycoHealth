/**
 * Formulário de login com e-mail e senha.
 * Usado em src/app/login/page.tsx; redireciona para o dashboard conforme o papel do usuário.
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

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  /* --- Estado e hooks --- */
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* --- Handlers de eventos --- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao entrar");
        return;
      }

      const role = data.user.role;
      router.push(resolvePostAuthPath(role, redirectTo));
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  /* --- Renderização --- */
  return (
    <Card title="Entrar" className="auth-card">
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="auth-links">
        <p>
          Não tem conta?{" "}
          <Link href="/register/patient">Cadastre-se como paciente</Link> ou{" "}
          <Link href="/register/psychologist">como psicólogo</Link>
        </p>
      </div>
    </Card>
  );
}
