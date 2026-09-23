import type { MemoryCategory } from "./database";

export interface Memory {
  id: string;
  coupleId: string;
  userId: string;
  storagePath: string;
  mediaType: "image" | "video";
  url: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  category: MemoryCategory;
  isFavorite: boolean;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  encontro: "Encontro",
  viagem: "Viagem",
  aniversario: "Aniversário",
  passeio: "Passeio",
  comida: "Comida",
  familia: "Família",
  especial: "Momento especial",
  outros: "Outros",
};

export const CATEGORY_ICONS: Record<MemoryCategory, string> = {
  encontro: "❤️",
  viagem: "✈️",
  aniversario: "🎂",
  passeio: "🚶",
  comida: "🍽️",
  familia: "👨‍👩‍👧",
  especial: "✨",
  outros: "📌",
};
