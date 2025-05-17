"use client";

import { IconMapPin } from "@tabler/icons-react";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SAMPLE_EMAIL = "admin@example.com";
const SAMPLE_PASSWORD = "admin123";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (data: { email: string; password: string }) => {
    setIsLoading(true);

    setTimeout(() => {
      if (data.email === SAMPLE_EMAIL && data.password === SAMPLE_PASSWORD) {
        localStorage.setItem("isLoggedIn", "true");
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <IconMapPin className="size-4" />
          </div>
          Summer Journeys
        </a>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
