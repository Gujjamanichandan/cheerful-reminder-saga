
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These values will be replaced through the Supabase integration
const supabaseUrl = '';
const supabaseAnonKey = '';

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
