import React, { ReactNode } from "react";
import { UserProvider } from "@/contexts/user-context";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  return <UserProvider>{children}</UserProvider>;
}
