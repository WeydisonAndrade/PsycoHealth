"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LOGOUT_REDIRECT_PATH } from "@/lib/auth-routes";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  label?: string;
}

/** Encerra sessão e redireciona para a landing */
export function LogoutButton({
  variant = "secondary",
  size = "sm",
  fullWidth,
  className = "",
  label = "Sair",
}: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "POST" });
    router.push(LOGOUT_REDIRECT_PATH);
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      onClick={handleLogout}
    >
      {label}
    </Button>
  );
}
