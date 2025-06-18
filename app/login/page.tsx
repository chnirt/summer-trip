import Image from "next/image";
import { LoginForm } from "@/components/login-form";

import logoImage from "../../public/logo.jpeg";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getProfile } from "@/services/profile";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const email = session.user?.email;
    const profile = await getProfile(email);

    if (profile?.role === "admin") {
      redirect("/admin/dashboard"); // Redirect admin to admin dashboard
    }

    redirect("/");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a
          href="#"
          className="flex flex-col items-center gap-2 self-center font-medium"
        >
          <div>
            <Image
              src={logoImage}
              alt="Logo"
              style={{ objectFit: "cover" }}
              priority
              className="w-40"
            />
          </div>
          Happy Trip – Togetherness 2025
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
