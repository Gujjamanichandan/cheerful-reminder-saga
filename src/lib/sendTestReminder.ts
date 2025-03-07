
import { supabase } from "@/lib/supabase";

export async function checkRemindersManually() {
  try {
    const { data, error } = await supabase.functions.invoke("check-reminders", {
      method: "POST",
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error checking reminders:", error);
    return { success: false, error };
  }
}

export async function sendTestReminderEmail(
  email: string,
  personName: string,
  eventType: "birthday" | "anniversary",
  eventDate: string,
  daysUntil: number = 0,
  customMessage: string = ""
) {
  try {
    const { data, error } = await supabase.functions.invoke("send-reminder-email", {
      method: "POST",
      body: {
        email,
        personName,
        eventType,
        eventDate,
        daysUntil,
        customMessage,
      },
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error("Error sending test reminder:", error);
    return { success: false, error };
  }
}
