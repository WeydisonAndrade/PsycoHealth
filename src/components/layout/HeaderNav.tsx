"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { SessionPayload } from "@/lib/session";

interface HeaderNavProps {
  session: SessionPayload | null;
}

export function HeaderNav({ session }: HeaderNavProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="nav-actions">
      <ul className="nav-list">
        <li>
          <Link href="/psychologists">Psicólogos</Link>
        </li>
        {session ? (
          <>
            <li>
              <Link
                href={
                  session.role === "PSYCHOLOGIST"
                    ? "/dashboard/psychologist"
                    : "/dashboard/patient"
                }
              >
                Minha área
              </Link>
            </li>
            <li>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Entrar</Link>
            </li>
            <li>
              <Link href="/register/patient">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
