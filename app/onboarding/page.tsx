"use client";

import Image from "next/image";

import ProfileForm from "@/components/profile-form";

import backgroundImage from "../../public/background.jpg";

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
        priority
      />
      <div className="relative w-full max-w-md">
        <ProfileForm />
      </div>
    </main>
  );
}
