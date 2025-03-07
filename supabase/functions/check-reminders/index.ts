
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://nflrubpdjebbqbdacbli.supabase.co";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Reminder {
  id: string;
  user_id: string;
  person_name: string;
  type: "birthday" | "anniversary";
  date: string;
  relationship: string;
  custom_message: string;
  notification_timing: number[];
  notification_method: string;
  archived: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
}

async function getUser(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

async function sendReminderEmail(
  userEmail: string,
  reminder: Reminder,
  daysUntil: number
) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-reminder-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseServiceRoleKey}`,
        },
        body: JSON.stringify({
          email: userEmail,
          personName: reminder.person_name,
          eventType: reminder.type,
          eventDate: reminder.date,
          daysUntil: daysUntil,
          customMessage: reminder.custom_message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending reminder email:", error);
    throw error;
  }
}

function calculateDaysUntil(dateString: string): number {
  const targetDate = new Date(dateString);
  const today = new Date();
  
  // Normalize both dates to midnight for accurate day calculation
  today.setHours(0, 0, 0, 0);
  const todayYear = today.getFullYear();
  
  // Set the target date to this year
  targetDate.setFullYear(todayYear);
  
  // If the date has already passed this year, set it to next year
  if (targetDate < today) {
    targetDate.setFullYear(todayYear + 1);
  }
  
  // Calculate difference in milliseconds
  const differenceMs = targetDate.getTime() - today.getTime();
  
  // Convert to days
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting reminder check job");
    
    // Get all non-archived reminders
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("archived", false);

    if (error) {
      throw error;
    }

    console.log(`Found ${reminders?.length || 0} active reminders`);
    
    const emailsSent = [];

    // Check each reminder
    for (const reminder of reminders || []) {
      const daysUntil = calculateDaysUntil(reminder.date);
      
      // Check if we should send a notification today based on notification_timing
      if (reminder.notification_timing.includes(daysUntil)) {
        const user = await getUser(reminder.user_id);
        
        if (user && user.email) {
          // Only send emails (we can add push notifications later)
          if (reminder.notification_method === "email" || reminder.notification_method === "both") {
            console.log(`Sending ${reminder.type} reminder for ${reminder.person_name} to ${user.email} (${daysUntil} days until)`);
            
            const result = await sendReminderEmail(user.email, reminder, daysUntil);
            emailsSent.push({
              reminderType: reminder.type,
              personName: reminder.person_name,
              userEmail: user.email,
              daysUntil: daysUntil,
              result: result
            });
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Checked ${reminders?.length || 0} reminders, sent ${emailsSent.length} emails`,
        emailsSent: emailsSent 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error checking reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
