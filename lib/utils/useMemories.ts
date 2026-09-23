"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMyCoupleId, mapMemory, toSignedUrls } from "@/lib/utils/memories";
import type { Memory } from "@/types";

export function useMemories() {
  const supabase = createClient();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const cid = await getMyCoupleId(supabase, user.id);
    setCoupleId(cid);
    if (!cid) {
      setMemories([]);
      setLoading(false);
      return;
    }

    const { data: rows } = await supabase
      .from("memories")
      .select("*")
      .eq("couple_id", cid)
      .order("date", { ascending: false });

    if (!rows || rows.length === 0) {
      setMemories([]);
      setLoading(false);
      return;
    }

    const urls = await toSignedUrls(
      supabase,
      rows.map((r) => r.storage_path)
    );
    setMemories(rows.map((r) => mapMemory(r, urls[r.storage_path] ?? "")));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { memories, coupleId, loading, reload: load };
}
