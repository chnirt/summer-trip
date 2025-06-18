import { createClient } from "@/utils/supabase/server";

export async function getProfile(email: string | undefined) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();
  if (error) throw error;
  return data;
}
