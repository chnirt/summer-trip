import Image from "next/image";
import { LoginForm } from "@/components/login-form";

import logoImage from "../../public/logo.jpeg";

export default async function LoginPage() {
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
