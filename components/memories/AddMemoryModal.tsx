"use client";

import { useRef, useState } from "react";
import { UploadCloud, Loader2, Heart } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { getMyCoupleId } from "@/lib/utils/memories";
import { CATEGORY_LABELS } from "@/types";
import type { MemoryCategory } from "@/types/database";

interface AddMemoryModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddMemoryModal({ open, onClose, onCreated }: AddMemoryModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MemoryCategory>("especial");
  const [isFavorite, setIsFavorite] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile(f: File | null) {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    setLocation("");
    setDescription("");
    setCategory("especial");
    setIsFavorite(false);
    setError(null);
  }

  async function handleSave() {
    if (!file || !title) {
      setError("Adiciona uma foto e um título.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada.");

      const coupleId = await getMyCoupleId(supabase, user.id);

      if (!coupleId) throw new Error("Casal não encontrado.");

      const ext = file.name.split(".").pop();
      const storagePath = `${coupleId}/${crypto.randomUUID()}.${ext}`;
      const mediaType = file.type.startsWith("video") ? "video" : "image";

      const { error: uploadError } = await supabase.storage
        .from("memories")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("memories").insert({
        couple_id: coupleId,
        user_id: user.id,
        storage_path: storagePath,
        media_type: mediaType,
        title,
        description: description || null,
        date,
        location: location || null,
        category,
        is_favorite: isFavorite,
      });
      if (insertError) throw insertError;

      reset();
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Nova memória">
      <div className="space-y-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) pickFile(f);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden flex items-center justify-center ${
            dragOver ? "border-accent bg-accent/5" : "border-white/10"
          } ${preview ? "h-56" : "h-40"}`}
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-ink-secondary text-sm px-4 text-center">
              <UploadCloud size={22} />
              Arrasta uma foto ou vídeo, ou toca para escolher
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <Input
          placeholder="Título — ex: Nosso primeiro jantar juntos"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Input
            placeholder="Local — ex: Maputo"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <Textarea
          placeholder="Uma noite simples, mas que ficou marcada..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MemoryCategory)}
          className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-ink-primary outline-none focus:border-accent/60"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-bg-card">
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setIsFavorite((v) => !v)}
          className="flex items-center gap-2 text-sm text-ink-secondary"
        >
          <Heart
            size={18}
            className={isFavorite ? "text-accent" : "text-ink-secondary"}
            fill={isFavorite ? "currentColor" : "none"}
          />
          Guardar como momento especial
        </button>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <Button className="w-full" size="lg" disabled={saving} onClick={handleSave}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : "Guardar memória"}
        </Button>
      </div>
    </Modal>
  );
}
