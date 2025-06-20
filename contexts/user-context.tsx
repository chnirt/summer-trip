"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

type UserProfile = {
  email: string | undefined;
  profile: {
    id: string;
    email: string;
    full_name: string;
    employee_code: string;
    department: string;
    region: "north" | "central" | "south" | "phuquoc" | "foreign";
    is_confirmed: boolean;
    role: "user" | "admin";
  };
  session: unknown;
};

const UserContext = createContext<UserProfile | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const email = session.user.email;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      setUserProfile({ email, profile, session });
    }
    fetchUser();
  }, []);

  if (!userProfile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={userProfile}>{children}</UserContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserContext);
}
