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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          postal_code: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          postal_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      driver_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string
          assigned_by: string | null
          driver_id: string
          id: string
          rejected_at: string | null
          rejection_reason: string | null
          shipment_id: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_by?: string | null
          driver_id: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          shipment_id: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string
          assigned_by?: string | null
          driver_id?: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          shipment_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_assignments_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          created_at: string
          id: string
          license_number: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_number: string | null
          vehicle_type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_number?: string | null
          vehicle_type?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          created_at: string
          customer_id: string
          delivered_at: string | null
          delivery_location: string
          delivery_notes: string | null
          delivery_photo: string | null
          delivery_signature: string | null
          description: string | null
          driver_id: string | null
          estimated_value: number | null
          expected_delivery_date: string | null
          fragile: boolean
          id: string
          package_size: string | null
          parcel_type: string | null
          picked_up_at: string | null
          pickup_date: string | null
          pickup_location: string
          quantity: number | null
          receiver_address: string | null
          receiver_city: string | null
          receiver_email: string | null
          receiver_name: string
          receiver_phone: string | null
          receiver_postal_code: string | null
          receiver_state: string | null
          sender_address: string | null
          sender_city: string | null
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          sender_postal_code: string | null
          sender_state: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          delivered_at?: string | null
          delivery_location?: string
          delivery_notes?: string | null
          delivery_photo?: string | null
          delivery_signature?: string | null
          description?: string | null
          driver_id?: string | null
          estimated_value?: number | null
          expected_delivery_date?: string | null
          fragile?: boolean
          id?: string
          package_size?: string | null
          parcel_type?: string | null
          picked_up_at?: string | null
          pickup_date?: string | null
          pickup_location?: string
          quantity?: number | null
          receiver_address?: string | null
          receiver_city?: string | null
          receiver_email?: string | null
          receiver_name?: string
          receiver_phone?: string | null
          receiver_postal_code?: string | null
          receiver_state?: string | null
          sender_address?: string | null
          sender_city?: string | null
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          sender_postal_code?: string | null
          sender_state?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          delivered_at?: string | null
          delivery_location?: string
          delivery_notes?: string | null
          delivery_photo?: string | null
          delivery_signature?: string | null
          description?: string | null
          driver_id?: string | null
          estimated_value?: number | null
          expected_delivery_date?: string | null
          fragile?: boolean
          id?: string
          package_size?: string | null
          parcel_type?: string | null
          picked_up_at?: string | null
          pickup_date?: string | null
          pickup_location?: string
          quantity?: number | null
          receiver_address?: string | null
          receiver_city?: string | null
          receiver_email?: string | null
          receiver_name?: string
          receiver_phone?: string | null
          receiver_postal_code?: string | null
          receiver_state?: string | null
          sender_address?: string | null
          sender_city?: string | null
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          sender_postal_code?: string | null
          sender_state?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          shipment_id?: string
          status?: Database["public"]["Enums"]["shipment_status"]
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      notify_admins: {
        Args: { _body: string; _link: string; _title: string }
        Returns: undefined
      }
      track_parcel: { Args: { _tracking_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "driver" | "customer"
      shipment_status:
        | "Pending"
        | "Assigned"
        | "Accepted"
        | "Picked Up"
        | "In Transit"
        | "Out for Delivery"
        | "Delivered"
        | "Rejected"
        | "Cancelled"
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
      app_role: ["admin", "driver", "customer"],
      shipment_status: [
        "Pending",
        "Assigned",
        "Accepted",
        "Picked Up",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Rejected",
        "Cancelled",
      ],
    },
  },
} as const
