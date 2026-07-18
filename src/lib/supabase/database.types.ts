export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          expires_at: string | null
          id: string
          is_pinned: boolean
          is_published: boolean
          starts_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          starts_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          is_published?: boolean
          starts_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      churches: {
        Row: {
          address: string
          category: string
          city: string
          contact_phone: string | null
          country: string
          created_at: string
          id: string
          is_published: boolean
          lat: number | null
          lng: number | null
          name: string
          region: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          address?: string
          category?: string
          city?: string
          contact_phone?: string | null
          country?: string
          created_at?: string
          id?: string
          is_published?: boolean
          lat?: number | null
          lng?: number | null
          name: string
          region?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          address?: string
          category?: string
          city?: string
          contact_phone?: string | null
          country?: string
          created_at?: string
          id?: string
          is_published?: boolean
          lat?: number | null
          lng?: number | null
          name?: string
          region?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_published: boolean
          leader_name: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          leader_name?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          leader_name?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      event_pricing_tiers: {
        Row: {
          category: string
          created_at: string
          ends_on: string | null
          event_id: string
          id: string
          price_cents: number
          sort_order: number
          starts_on: string | null
        }
        Insert: {
          category: string
          created_at?: string
          ends_on?: string | null
          event_id: string
          id?: string
          price_cents?: number
          sort_order?: number
          starts_on?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          ends_on?: string | null
          event_id?: string
          id?: string
          price_cents?: number
          sort_order?: number
          starts_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_pricing_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrants: {
        Row: {
          category: string
          created_at: string
          full_name: string
          id: string
          registration_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          full_name: string
          id?: string
          registration_id: string
        }
        Update: {
          category?: string
          created_at?: string
          full_name?: string
          id?: string
          registration_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrants_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "event_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          church_name: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          event_id: string
          id: string
          notes: string | null
          registration_type: string
          status: string
          updated_at: string
        }
        Insert: {
          church_name?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          registration_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          church_name?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          registration_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_image_url: string | null
          created_at: string
          description: string
          end_date: string
          event_type: string
          id: string
          is_featured: boolean
          is_published: boolean
          location: string
          slug: string
          start_date: string
          theme_text: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          description?: string
          end_date: string
          event_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          location?: string
          slug: string
          start_date: string
          theme_text?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          location?: string
          slug?: string
          start_date?: string
          theme_text?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaders: {
        Row: {
          bio: string | null
          category: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_published: boolean
          phone: string | null
          photo_url: string | null
          sort_order: number
          tenure_end: string | null
          tenure_start: string | null
          title: string
          updated_at: string
          zone_name: string | null
        }
        Insert: {
          bio?: string | null
          category: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_published?: boolean
          phone?: string | null
          photo_url?: string | null
          sort_order?: number
          tenure_end?: string | null
          tenure_start?: string | null
          title?: string
          updated_at?: string
          zone_name?: string | null
        }
        Update: {
          bio?: string | null
          category?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_published?: boolean
          phone?: string | null
          photo_url?: string | null
          sort_order?: number
          tenure_end?: string | null
          tenure_start?: string | null
          title?: string
          updated_at?: string
          zone_name?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          album: string
          alt_text: string
          caption: string | null
          created_at: string
          id: string
          sort_order: number
          uploaded_by: string | null
          url: string
        }
        Insert: {
          album?: string
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          uploaded_by?: string | null
          url: string
        }
        Update: {
          album?: string
          alt_text?: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: string
        }
        Relationships: []
      }
      sermons_livestreams: {
        Row: {
          created_at: string
          id: string
          is_live: boolean
          is_published: boolean
          platform: string
          recording_url: string | null
          scheduled_at: string | null
          speaker: string | null
          stream_url: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_live?: boolean
          is_published?: boolean
          platform?: string
          recording_url?: string | null
          scheduled_at?: string | null
          speaker?: string | null
          stream_url: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_live?: boolean
          is_published?: boolean
          platform?: string
          recording_url?: string | null
          scheduled_at?: string | null
          speaker?: string | null
          stream_url?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string
          page_key: string
          section_key: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string
          page_key: string
          section_key: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          page_key?: string
          section_key?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_content_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string
          church_name: string
          contact_email: string
          contact_phone: string
          facebook_url: string | null
          id: boolean
          instagram_url: string | null
          prayer_line_access_code: string | null
          prayer_line_number: string | null
          prayer_line_time: string | null
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          address?: string
          church_name?: string
          contact_email?: string
          contact_phone?: string
          facebook_url?: string | null
          id?: boolean
          instagram_url?: string | null
          prayer_line_access_code?: string | null
          prayer_line_number?: string | null
          prayer_line_time?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          address?: string
          church_name?: string
          contact_email?: string
          contact_phone?: string
          facebook_url?: string | null
          id?: boolean
          instagram_url?: string | null
          prayer_line_access_code?: string | null
          prayer_line_number?: string | null
          prayer_line_time?: string | null
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      tenets: {
        Row: {
          body: string
          created_at: string
          id: string
          is_published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
