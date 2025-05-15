import Link from "next/link";
import { MapPin } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="text-primary h-5 w-5" />
          <h1 className="text-xl font-semibold">Summer Journeys</h1>
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
