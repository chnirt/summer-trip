"use client";

import Image from "next/image";
import ConfirmInfoForm from "@/components/confirm-info-form";

import backgroundImage from "../../public/background.jpg";

export default function ConfirmInfoPage() {
  return (
    <div className="bg-muted relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        style={{ objectFit: "cover" }}
        priority
      />
      <div className="z-0 flex w-full max-w-sm flex-col gap-6">
        <ConfirmInfoForm />
      </div>
    </div>
  );
}
