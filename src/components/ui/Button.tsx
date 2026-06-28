/**
 * Botão reutilizável com variantes visuais e tamanhos padronizados.
 * Usado em formulários de auth, dashboards, cards de agendamento e navegação (HeaderNav).
 */
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: ReactNode;
}

/** Mapeamento de variantes para classes CSS (.btn-primary, .btn-secondary, etc.) */
const variantClass = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

/** Mapeamento de tamanhos para classes CSS (.btn-sm, .btn-lg) */
const sizeClass = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  /* --- Renderização --- */
  return (
    <button
      className={`btn ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? "btn-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
