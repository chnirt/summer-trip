"use client";

import ProfileForm from "@/components/profile-form";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <ProfileForm />
      </div>
    </main>
  );
}
