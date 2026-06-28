/**
 * Mensagem de feedback visual (erro, sucesso ou informação).
 * Usado em formulários de auth, agendamento, pagamento e sala de vídeo.
 */
interface AlertProps {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
}

/** Mapeamento de tipos para classes CSS (.alert-error, .alert-success, etc.) */
const typeClass = {
  error: "alert-error",
  success: "alert-success",
  info: "alert-info",
};

export function Alert({ type = "info", children }: AlertProps) {
  /* --- Renderização --- */
  return <div className={`alert ${typeClass[type]}`} role="alert">{children}</div>;
}
