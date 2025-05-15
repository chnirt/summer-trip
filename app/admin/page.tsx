"use client";

import { IconMapPin } from "@tabler/icons-react";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <IconMapPin className="size-4" />
          </div>
          Summer Journeys
        </a>
        <LoginForm onClick={() => router.push("/admin/dashboard")} />
      </div>
    </div>
  );
}
