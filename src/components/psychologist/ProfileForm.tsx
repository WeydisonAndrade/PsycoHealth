"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { SPECIALTY_OPTIONS } from "@/lib/utils";

interface Profile {
  bio: string;
  specialties: string[];
  sessionPrice: number;
  photoUrl: string | null;
}

interface ProfileFormProps {
  initial: Profile;
  onSaved?: () => void;
}

export function ProfileForm({ initial, onSaved }: ProfileFormProps) {
  const [bio, setBio] = useState(initial.bio);
  const [sessionPrice, setSessionPrice] = useState(initial.sessionPrice);
  const [photoUrl, setPhotoUrl] = useState(initial.photoUrl ?? "");
  const [specialties, setSpecialties] = useState<string[]>(initial.specialties);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSpecialty(s: string) {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/psychologists/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, sessionPrice, photoUrl, specialties }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar");
        return;
      }

      setMessage("Perfil atualizado com sucesso");
      onSaved?.();
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Editar perfil">
      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <Textarea label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        <Input
          label="Valor da sessão (R$)"
          type="number"
          min={50}
          value={sessionPrice}
          onChange={(e) => setSessionPrice(Number(e.target.value))}
        />
        <Input
          label="URL da foto (opcional)"
          type="url"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          placeholder="https://..."
        />
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
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar perfil"}
        </Button>
      </form>
    </Card>
  );
}
