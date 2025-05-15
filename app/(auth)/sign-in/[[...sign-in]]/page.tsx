import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-svh flex-1 items-center justify-center">
      <SignIn forceRedirectUrl="/onboarding" />
    </div>
  );
}
