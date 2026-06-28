/**
 * Formulário de cadastro de psicólogo com CRP, preço, bio e especialidades.
 * Usado em src/app/register/psychologist/page.tsx; redireciona para /dashboard/psychologist.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { SPECIALTY_OPTIONS } from "@/lib/utils";

export function RegisterPsychologistForm() {
  /* --- Estado e hooks --- */
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [crp, setCrp] = useState("");
  const [bio, setBio] = useState("");
  const [sessionPrice, setSessionPrice] = useState(150);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* --- Handlers de eventos --- */
  function toggleSpecialty(s: string) {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (specialties.length === 0) {
      setError("Selecione ao menos uma especialidade");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/psychologist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          crp,
          bio,
          sessionPrice,
          specialties,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao cadastrar");
        return;
      }

      router.push("/dashboard/psychologist");
      router.refresh();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  /* --- Renderização --- */
  return (
    <Card
      title="Cadastro de Psicólogo"
      subtitle="Junte-se à plataforma e atenda pacientes online"
      className="auth-card"
    >
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="CRP" value={crp} onChange={(e) => setCrp(e.target.value)} required placeholder="Ex: 06/123456" />
        <Input
          label="Valor da sessão (R$)"
          type="number"
          min={50}
          value={sessionPrice}
          onChange={(e) => setSessionPrice(Number(e.target.value))}
          required
        />
        <Textarea label="Bio (opcional)" value={bio} onChange={(e) => setBio(e.target.value)} />
        <div className="form-group">
          <span className="label">Especialidades</span>
          <div className="tags mt-1">
            {SPECIALTY_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className={`tag tag-selectable ${specialties.includes(s) ? "selected" : ""}`}
                onClick={() => toggleSpecialty(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Cadastrando..." : "Criar conta profissional"}
        </Button>
      </form>
      <div className="auth-links">
        <p>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
        <p className="mt-1">
          É paciente? <Link href="/register/patient">Cadastre-se aqui</Link>
        </p>
      </div>
    </Card>
  );
}
