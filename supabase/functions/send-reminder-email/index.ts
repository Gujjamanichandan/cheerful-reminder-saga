
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderEmailRequest {
  email: string;
  personName: string;
  eventType: "birthday" | "anniversary";
  eventDate: string;
  daysUntil: number;
  customMessage: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, personName, eventType, eventDate, daysUntil, customMessage }: ReminderEmailRequest = 
      await req.json();

    const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    const dayText = daysUntil === 0 
      ? "today" 
      : daysUntil === 1 
        ? "tomorrow" 
        : `in ${daysUntil} days`;

    const eventTypeCapitalized = eventType.charAt(0).toUpperCase() + eventType.slice(1);
    
    const emailResponse = await resend.emails.send({
      from: "Reminders <onboarding@resend.dev>",
      to: [email],
      subject: `${eventTypeCapitalized} Reminder: ${personName}'s ${eventType} is ${dayText}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: ${eventType === 'birthday' ? '#3b82f6' : '#ec4899'}; text-align: center;">
            ${eventTypeCapitalized} Reminder
          </h1>
          <p style="font-size: 18px;">
            Hello,
          </p>
          <p style="font-size: 16px;">
            This is a reminder that <strong>${personName}'s ${eventType}</strong> is ${dayText} (${formattedDate}).
          </p>
          ${customMessage ? `
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;">
              <em>"${customMessage}"</em>
            </p>
          </div>
          ` : ''}
          <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 14px; color: #6b7280;">
              This is an automated reminder from your Reminder App.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reminder-email function:", error);
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
