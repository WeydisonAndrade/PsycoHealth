/**
 * Página de cadastro de pacientes.
 * Coleta dados pessoais e cria conta com perfil do tipo PATIENT.
 */
import { redirect } from "next/navigation";
import { RegisterPatientForm } from "@/components/auth/RegisterPatientForm";
import { getSession } from "@/lib/session";
import { isSafeRedirectPath, resolvePostAuthPath } from "@/lib/auth-routes";

export default async function RegisterPatientPage({
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
        <RegisterPatientForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
