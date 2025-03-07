
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// These values need to be populated with your Supabase project's URL and public API key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Tables = Database['public']['Tables'];
export type ReminderType = 'birthday' | 'anniversary';
export type NotificationMethod = 'email' | 'push' | 'both';

export interface Reminder {
  id: string;
  user_id: string;
  person_name: string;
  type: ReminderType;
  date: string;
  relationship: string;
  custom_message: string;
  notification_timing: number[];
  notification_method: NotificationMethod;
  created_at: string;
  archived: boolean;
}
