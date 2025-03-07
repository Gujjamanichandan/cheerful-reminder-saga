
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reminders: {
        Row: {
          id: string
          user_id: string
          person_name: string
          type: string
          date: string
          relationship: string
          custom_message: string
          notification_timing: number[]
          notification_method: string
          created_at: string
          archived: boolean
        }
        Insert: {
          id?: string
          user_id: string
          person_name: string
          type: string
          date: string
          relationship: string
          custom_message?: string
          notification_timing?: number[]
          notification_method?: string
          created_at?: string
          archived?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          person_name?: string
          type?: string
          date?: string
          relationship?: string
          custom_message?: string
          notification_timing?: number[]
          notification_method?: string
          created_at?: string
          archived?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
