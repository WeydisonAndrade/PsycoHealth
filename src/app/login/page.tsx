import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title text-center">Entrar</h1>
        <LoginForm />
      </div>
    </div>
  );
}
