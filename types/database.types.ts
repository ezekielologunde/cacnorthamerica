// Schema key renamed public -> cacna (2026-09-06): CACNA's own Supabase
// project no longer exists; this now models the isolated "cacna" schema in
// the shared cac-salvation-center project (see lib/supabase/server.ts and
// lib/supabase/client.ts, which pass db.schema:"cacna"). supabase-js infers
// the schema type param from the runtime db.schema string, so this key must
// match it exactly or every .from() call across the admin panel breaks.
// Table shapes are otherwise unchanged from the original generated types.
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
  cacna: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          active: boolean
          bg_color: string
          body: string | null
          created_at: string
          cta_text: string | null
          cta_url: string | null
          expires_at: string | null
          id: string
          placement: string
          sort_order: number
          text_color: string
          title: string
        }
        Insert: {
          active?: boolean
          bg_color?: string
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          expires_at?: string | null
          id?: string
          placement?: string
          sort_order?: number
          text_color?: string
          title: string
        }
        Update: {
          active?: boolean
          bg_color?: string
          body?: string | null
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          expires_at?: string | null
          id?: string
          placement?: string
          sort_order?: number
          text_color?: string
          title?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string
          created_at: string
          excerpt: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          authors: Json
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          authors?: Json
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          authors?: Json
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cac_world_news: {
        Row: {
          excerpt: string | null
          fetched_at: string
          id: string
          image_url: string | null
          published_at: string | null
          reviewed_at: string | null
          source_url: string
          status: string
          title: string
        }
        Insert: {
          excerpt?: string | null
          fetched_at?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          source_url: string
          status?: string
          title: string
        }
        Update: {
          excerpt?: string | null
          fetched_at?: string
          id?: string
          image_url?: string | null
          published_at?: string | null
          reviewed_at?: string | null
          source_url?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      checkin_people: {
        Row: {
          age: number | null
          allergies: string | null
          category: string
          checked_in_at: string | null
          checked_in_by: string | null
          church_name: string | null
          code: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          dcc: string | null
          full_name: string
          id: string
          idx: number
          meals: string | null
          payment_status: string
          ref: string
          stripe_session: string | null
          year: number
          zelle_ref: string | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          category: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          church_name?: string | null
          code: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          dcc?: string | null
          full_name: string
          id?: string
          idx: number
          meals?: string | null
          payment_status: string
          ref: string
          stripe_session?: string | null
          year: number
          zelle_ref?: string | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          category?: string
          checked_in_at?: string | null
          checked_in_by?: string | null
          church_name?: string | null
          code?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          dcc?: string | null
          full_name?: string
          id?: string
          idx?: number
          meals?: string | null
          payment_status?: string
          ref?: string
          stripe_session?: string | null
          year?: number
          zelle_ref?: string | null
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
      contact_submissions: {
        Row: {
          archived: boolean
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          archived?: boolean
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          archived?: boolean
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
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
      events: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          event_date: string
          event_url: string | null
          id: string
          location: string | null
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date: string
          event_url?: string | null
          id?: string
          location?: string | null
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          event_url?: string | null
          id?: string
          location?: string | null
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          category: string
          cloudinary_public_id: string
          created_at: string
          id: string
          published: boolean
          sort_order: number
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category?: string
          cloudinary_public_id: string
          created_at?: string
          id?: string
          published?: boolean
          sort_order?: number
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category?: string
          cloudinary_public_id?: string
          created_at?: string
          id?: string
          published?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      giving_invoices: {
        Row: {
          amount_paid_cents: number
          billing_reason: string | null
          claimed_at: string
          created_at: string
          email_done: boolean
          frequency: string | null
          invoice_id: string
          processing_fee_cents: number
          setup_fee_cents: number
          sheet_done: boolean
          subscription_id: string
          subtotal_cents: number
        }
        Insert: {
          amount_paid_cents: number
          billing_reason?: string | null
          claimed_at?: string
          created_at?: string
          email_done?: boolean
          frequency?: string | null
          invoice_id: string
          processing_fee_cents?: number
          setup_fee_cents?: number
          sheet_done?: boolean
          subscription_id: string
          subtotal_cents: number
        }
        Update: {
          amount_paid_cents?: number
          billing_reason?: string | null
          claimed_at?: string
          created_at?: string
          email_done?: boolean
          frequency?: string | null
          invoice_id?: string
          processing_fee_cents?: number
          setup_fee_cents?: number
          sheet_done?: boolean
          subscription_id?: string
          subtotal_cents?: number
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
          person_key: string | null
          phone: string | null
          photo_url: string | null
          sort_order: number
          tenure_end: number | null
          tenure_start: number | null
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
          person_key?: string | null
          phone?: string | null
          photo_url?: string | null
          sort_order?: number
          tenure_end?: number | null
          tenure_start?: number | null
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
          person_key?: string | null
          phone?: string | null
          photo_url?: string | null
          sort_order?: number
          tenure_end?: number | null
          tenure_start?: number | null
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
      newsletter_subscribers: {
        Row: {
          active: boolean | null
          email: string
          id: string
          name: string | null
          source: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          active?: boolean | null
          email: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          active?: boolean | null
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
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
      serve_signups: {
        Row: {
          convention_year: number | null
          created_at: string
          email: string
          guardian_consent: boolean
          id: string
          name: string
          note: string | null
          phone: string | null
          teams: string[]
          under_18: boolean
        }
        Insert: {
          convention_year?: number | null
          created_at?: string
          email: string
          guardian_consent?: boolean
          id?: string
          name: string
          note?: string | null
          phone?: string | null
          teams: string[]
          under_18?: boolean
        }
        Update: {
          convention_year?: number | null
          created_at?: string
          email?: string
          guardian_consent?: boolean
          id?: string
          name?: string
          note?: string | null
          phone?: string | null
          teams?: string[]
          under_18?: boolean
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
      social_credentials: {
        Row: {
          access_expires_at: string
          platform: string
          refresh_expires_at: string
          secret: string
          updated_at: string
        }
        Insert: {
          access_expires_at: string
          platform: string
          refresh_expires_at: string
          secret: string
          updated_at?: string
        }
        Update: {
          access_expires_at?: string
          platform?: string
          refresh_expires_at?: string
          secret?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_post_targets: {
        Row: {
          attempts: number
          caption_sent: string
          caption_title: string
          claimed_at: string | null
          error_code: string | null
          finished_at: string | null
          id: string
          platform: string
          platform_container_id: string | null
          platform_post_id: string | null
          post_id: string
          retryable: boolean
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          caption_sent?: string
          caption_title?: string
          claimed_at?: string | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          platform: string
          platform_container_id?: string | null
          platform_post_id?: string | null
          post_id: string
          retryable?: boolean
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          caption_sent?: string
          caption_title?: string
          claimed_at?: string | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          platform?: string
          platform_container_id?: string | null
          platform_post_id?: string | null
          post_id?: string
          retryable?: boolean
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_post_targets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          caption: string
          created_at: string
          dry_run: boolean
          id: string
          submitted_by: string
          title: string
          video_bytes: number
          video_duration_s: number | null
          video_codec: string | null
          video_format: string
          video_frame_rate: number | null
          video_height: number | null
          video_public_id: string
          video_url: string
          video_width: number | null
        }
        Insert: {
          caption?: string
          created_at?: string
          dry_run: boolean
          id?: string
          submitted_by: string
          title: string
          video_bytes: number
          video_duration_s?: number | null
          video_codec?: string | null
          video_format: string
          video_frame_rate?: number | null
          video_height?: number | null
          video_public_id: string
          video_url: string
          video_width?: number | null
        }
        Update: {
          caption?: string
          created_at?: string
          dry_run?: boolean
          id?: string
          submitted_by?: string
          title?: string
          video_bytes?: number
          video_duration_s?: number | null
          video_codec?: string | null
          video_format?: string
          video_frame_rate?: number | null
          video_height?: number | null
          video_public_id?: string
          video_url?: string
          video_width?: number | null
        }
        Relationships: []
      }
      social_settings: {
        Row: {
          dry_run: boolean
          facebook_enabled: boolean
          id: number
          instagram_enabled: boolean
          posting_enabled: boolean
          tiktok_enabled: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          dry_run?: boolean
          facebook_enabled?: boolean
          id?: number
          instagram_enabled?: boolean
          posting_enabled?: boolean
          tiktok_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          dry_run?: boolean
          facebook_enabled?: boolean
          id?: number
          instagram_enabled?: boolean
          posting_enabled?: boolean
          tiktok_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
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

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "cacna">]

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
  cacna: {
    Enums: {},
  },
} as const
