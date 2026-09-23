export type MemoryCategory =
  | "encontro"
  | "viagem"
  | "aniversario"
  | "passeio"
  | "comida"
  | "familia"
  | "especial"
  | "outros";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Relationships: [];
      };
      couples: {
        Row: {
          id: string;
          name: string | null;
          partner_1: string;
          partner_2: string | null;
          start_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          partner_1: string;
          partner_2?: string | null;
          start_date?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          partner_2?: string | null;
          start_date?: string | null;
        };
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          couple_id: string;
          user_id: string;
          storage_path: string;
          media_type: "image" | "video";
          title: string;
          description: string | null;
          date: string;
          location: string | null;
          category: MemoryCategory;
          is_favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_id: string;
          user_id: string;
          storage_path: string;
          media_type: "image" | "video";
          title: string;
          description?: string | null;
          date: string;
          location?: string | null;
          category?: MemoryCategory;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          date?: string;
          location?: string | null;
          category?: MemoryCategory;
          is_favorite?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
