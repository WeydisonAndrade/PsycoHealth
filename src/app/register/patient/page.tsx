/**
 * Página de cadastro de pacientes.
 * Coleta dados pessoais e cria conta com perfil do tipo PATIENT.
 */
import { RegisterPatientForm } from "@/components/auth/RegisterPatientForm";

export default function RegisterPatientPage() {
  return (
    <div className="page">
      <div className="container">
        {/* Formulário de registro com validação de campos obrigatórios */}
        <RegisterPatientForm />
      </div>
    </div>
  );
}
