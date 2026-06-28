/**
 * Página de autenticação — permite que pacientes e psicólogos
 * façam login com e-mail e senha cadastrados.
 */
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title text-center">Entrar</h1>
        {/* Formulário com validação e redirecionamento pós-login */}
        <LoginForm />
      </div>
    </div>
  );
}
