// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;
import type { Database } from "@/types/database";
import type { Memory } from "@/types";

export async function getMyCoupleId(
  supabase: AnySupabaseClient,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("couples")
    .select("id")
    .or(`partner_1.eq.${userId},partner_2.eq.${userId}`)
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

// O bucket "memories" é privado, por isso usamos sempre URLs assinadas
// com validade curta em vez de URLs públicas.
export async function toSignedUrl(
  supabase: AnySupabaseClient,
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("memories")
    .createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data) return "";
  return data.signedUrl;
}

export async function toSignedUrls(
  supabase: AnySupabaseClient,
  storagePaths: string[],
  expiresInSeconds = 3600
): Promise<Record<string, string>> {
  if (storagePaths.length === 0) return {};
  const { data, error } = await supabase.storage
    .from("memories")
    .createSignedUrls(storagePaths, expiresInSeconds);
  if (error || !data) return {};
  const map: Record<string, string> = {};
  data.forEach((d: { path: string | null; signedUrl: string }) => {
    if (d.signedUrl && d.path) map[d.path] = d.signedUrl;
  });
  return map;
}

export function mapMemory(
  row: Database["public"]["Tables"]["memories"]["Row"],
  url: string
): Memory {
  return {
    id: row.id,
    coupleId: row.couple_id,
    userId: row.user_id,
    storagePath: row.storage_path,
    mediaType: row.media_type,
    url,
    title: row.title,
    description: row.description,
    date: row.date,
    location: row.location,
    category: row.category as Memory["category"],
    isFavorite: row.is_favorite,
    createdAt: row.created_at,
  };
}
