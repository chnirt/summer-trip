import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getRecords<T>(table: string): Promise<T[]> {
  const { data, error } = await supabase.from(table).select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getRecordById<T>(
  table: string,
  id: string,
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createRecord<T>(
  table: string,
  payload: Partial<T>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data!;
}

export async function updateRecord<T>(
  table: string,
  id: string,
  payload: Partial<T>,
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data!;
}

export async function deleteRecord(
  table: string,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
  return true;
}
