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
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
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
      orders: {
        Row: {
          amount_total: number
          created_at: string | null
          currency: string | null
          customer_email: string
          customer_name: string | null
          customer_phone: string | null
          id: string
          line_items: Json
          notes: string | null
          refunded_amount: number | null
          shipped_at: string | null
          shipping_city: string | null
          shipping_country: string | null
          shipping_line1: string | null
          shipping_line2: string | null
          shipping_name: string | null
          shipping_postal_code: string | null
          shipping_state: string | null
          status: string | null
          stripe_payment_intent: string | null
          stripe_session_id: string
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          amount_total: number
          created_at?: string | null
          currency?: string | null
          customer_email: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          refunded_amount?: number | null
          shipped_at?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_name?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id: string
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_total?: number
          created_at?: string | null
          currency?: string | null
          customer_email?: string
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          line_items?: Json
          notes?: string | null
          refunded_amount?: number | null
          shipped_at?: string | null
          shipping_city?: string | null
          shipping_country?: string | null
          shipping_line1?: string | null
          shipping_line2?: string | null
          shipping_name?: string | null
          shipping_postal_code?: string | null
          shipping_state?: string | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          archived: boolean
          created_at: string
          email: string | null
          id: string
          name: string | null
          request: string
          urgent: boolean
        }
        Insert: {
          archived?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          request: string
          urgent?: boolean
        }
        Update: {
          archived?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          request?: string
          urgent?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          badge: string | null
          category: string
          created_at: string
          description: string | null
          digital_file_url: string | null
          external_label: string | null
          external_link: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_digital: boolean
          name: string
          order_method: string
          price_cents: number
          price_display: string
          published: boolean
          sort_order: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          digital_file_url?: string | null
          external_label?: string | null
          external_link?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_digital?: boolean
          name: string
          order_method?: string
          price_cents?: number
          price_display?: string
          published?: boolean
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          digital_file_url?: string | null
          external_label?: string | null
          external_link?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_digital?: boolean
          name?: string
          order_method?: string
          price_cents?: number
          price_display?: string
          published?: boolean
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          approved: boolean
          content: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          approved?: boolean
          content: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          approved?: boolean
          content?: string
          created_at?: string
          id?: string
          name?: string
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
    Enums: {},
  },
} as const
