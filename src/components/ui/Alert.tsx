interface AlertProps {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
}

const typeClass = {
  error: "alert-error",
  success: "alert-success",
  info: "alert-info",
};

export function Alert({ type = "info", children }: AlertProps) {
  return <div className={`alert ${typeClass[type]}`} role="alert">{children}</div>;
}
