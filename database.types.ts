export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          search: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          search?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          search?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          blocks: Json | null
          client_id: string | null
          created_at: string
          created_by: string | null
          event_date: string | null
          event_type: string | null
          id: string
          music_url: string | null
          og_image_url: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          template_id: string | null
          theme_color: string | null
          title: string | null
        }
        Insert: {
          blocks?: Json | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          music_url?: string | null
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          template_id?: string | null
          theme_color?: string | null
          title?: string | null
        }
        Update: {
          blocks?: Json | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string | null
          event_type?: string | null
          id?: string
          music_url?: string | null
          og_image_url?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          template_id?: string | null
          theme_color?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          bucket: string | null
          created_at: string
          event_id: string | null
          fileName: string | null
          filePath: string | null
          id: string
          publicUrl: string | null
          template_id: string | null
          type: string | null
          uploaded_by: string | null
        }
        Insert: {
          bucket?: string | null
          created_at?: string
          event_id?: string | null
          fileName?: string | null
          filePath?: string | null
          id?: string
          publicUrl?: string | null
          template_id?: string | null
          type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          bucket?: string | null
          created_at?: string
          event_id?: string | null
          fileName?: string | null
          filePath?: string | null
          id?: string
          publicUrl?: string | null
          template_id?: string | null
          type?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      rsvps: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          message: string | null
          name: string
          people_count: number
          phone: string | null
          will_attend: boolean
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          message?: string | null
          name: string
          people_count: number
          phone?: string | null
          will_attend: boolean
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          message?: string | null
          name?: string
          people_count?: number
          phone?: string | null
          will_attend?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          blocks: Json | null
          created_at: string
          id: string
          music_url: string | null
          name: string
          og_image_url: string | null
          search: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          theme_color: string | null
        }
        Insert: {
          blocks?: Json | null
          created_at?: string
          id?: string
          music_url?: string | null
          name: string
          og_image_url?: string | null
          search?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          theme_color?: string | null
        }
        Update: {
          blocks?: Json | null
          created_at?: string
          id?: string
          music_url?: string | null
          name?: string
          og_image_url?: string | null
          search?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          theme_color?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { input: string }
        Returns: string
      }
    }
    Enums: {
      role: "owner" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ["owner", "editor", "viewer"],
    },
  },
} as const
