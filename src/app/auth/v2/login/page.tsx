import { redirect } from "next/navigation";

import { SuperadminLoginForm } from "@/app/auth/v2/login/superadmin-login-form";
import { getProfile } from "@/http/get-profile";

export default async function LoginPage() {
  const profile = await getProfile().catch(() => null);

  if (profile?.account.platformRole === "SUPERADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-8 p-6 sm:w-[380px]">
      <div className="space-y-2 text-center">
        <h1 className="font-medium text-3xl">Acesso Superadmin</h1>
        <p className="text-muted-foreground text-sm">Entre com suas credenciais de administrador da plataforma.</p>
      </div>
      <SuperadminLoginForm />
    </div>
  );
}
