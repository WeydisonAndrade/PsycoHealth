/**
 * Página de autenticação — permite que pacientes e psicólogos
 * façam login com e-mail e senha cadastrados.
 */
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSession } from "@/lib/session";
import { isSafeRedirectPath, resolvePostAuthPath } from "@/lib/auth-routes";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const { next } = await searchParams;
  const redirectTo = next && isSafeRedirectPath(next) ? next : undefined;

  if (session) {
    redirect(resolvePostAuthPath(session.role, redirectTo));
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title text-center">Entrar</h1>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
