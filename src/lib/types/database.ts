export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          class_id: string
          created_at: string
          data: string
          id: string
          status: string
          student_id: string
          studio_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          data: string
          id?: string
          status: string
          student_id: string
          studio_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          data?: string
          id?: string
          status?: string
          student_id?: string
          studio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_log: {
        Row: {
          enviado_em: string
          id: string
          payment_id: string | null
          student_id: string
          studio_id: string
        }
        Insert: {
          enviado_em?: string
          id?: string
          payment_id?: string | null
          student_id: string
          studio_id: string
        }
        Update: {
          enviado_em?: string
          id?: string
          payment_id?: string | null
          student_id?: string
          studio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_log_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_log_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_log_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          ativo: boolean
          created_at: string
          dias_semana: string[]
          faixa_etaria: string | null
          horario: string | null
          id: string
          modalidade: string
          nivel: string | null
          nome: string
          professor: string | null
          studio_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          dias_semana?: string[]
          faixa_etaria?: string | null
          horario?: string | null
          id?: string
          modalidade?: string
          nivel?: string | null
          nome: string
          professor?: string | null
          studio_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          dias_semana?: string[]
          faixa_etaria?: string | null
          horario?: string | null
          id?: string
          modalidade?: string
          nivel?: string | null
          nome?: string
          professor?: string | null
          studio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          origem: string
          studio_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          origem?: string
          studio_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          origem?: string
          studio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string
          data_pagamento: string | null
          id: string
          referencia_mes: string
          status: string
          student_id: string
          studio_id: string
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          referencia_mes: string
          status?: string
          student_id: string
          studio_id: string
          updated_at?: string
          valor: number
          vencimento: string
        }
        Update: {
          created_at?: string
          data_pagamento?: string | null
          id?: string
          referencia_mes?: string
          status?: string
          student_id?: string
          studio_id?: string
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          ativo: boolean
          class_id: string | null
          created_at: string
          data_nascimento: string | null
          dia_vencimento: number
          id: string
          mensalidade_valor: number
          modalidade: string | null
          nome: string
          observacoes: string | null
          responsavel_nome: string | null
          studio_id: string
          telefone_responsavel: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          class_id?: string | null
          created_at?: string
          data_nascimento?: string | null
          dia_vencimento?: number
          id?: string
          mensalidade_valor?: number
          modalidade?: string | null
          nome: string
          observacoes?: string | null
          responsavel_nome?: string | null
          studio_id: string
          telefone_responsavel?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          class_id?: string | null
          created_at?: string
          data_nascimento?: string | null
          dia_vencimento?: number
          id?: string
          mensalidade_valor?: number
          modalidade?: string | null
          nome?: string
          observacoes?: string | null
          responsavel_nome?: string | null
          studio_id?: string
          telefone_responsavel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_studio_id_fkey"
            columns: ["studio_id"]
            isOneToOne: false
            referencedRelation: "studios"
            referencedColumns: ["id"]
          },
        ]
      }
      studios: {
        Row: {
          cidade: string | null
          created_at: string
          id: string
          logo_url: string | null
          mensagem_cobranca_template: string
          nome: string
          onboarding_completo: boolean
          owner_id: string
          receber_resumo_diario: boolean
          responsavel_nome: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          mensagem_cobranca_template?: string
          nome: string
          onboarding_completo?: boolean
          owner_id: string
          receber_resumo_diario?: boolean
          responsavel_nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          mensagem_cobranca_template?: string
          nome?: string
          onboarding_completo?: boolean
          owner_id?: string
          receber_resumo_diario?: boolean
          responsavel_nome?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      updates: {
        Row: {
          created_at: string
          descricao: string
          id: string
          publicado_em: string
          titulo: string
        }
        Insert: {
          created_at?: string
          descricao: string
          id?: string
          publicado_em?: string
          titulo: string
        }
        Update: {
          created_at?: string
          descricao?: string
          id?: string
          publicado_em?: string
          titulo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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

// Aliases de conveniência usados nos componentes do app
export type PaymentStatus = "pago" | "pendente" | "atrasado";
export type AttendanceStatus = "presente" | "faltou" | "justificada";

export type Studio = Tables<"studios">;
export type ClassRow = Tables<"classes">;
export type Student = Tables<"students">;
export type Attendance = Omit<Tables<"attendance">, "status"> & { status: AttendanceStatus };
export type Payment = Omit<Tables<"payments">, "status"> & { status: PaymentStatus };
export type Lead = Tables<"leads">;
export type Update = Tables<"updates">;
export type BillingLog = Tables<"billing_log">;
