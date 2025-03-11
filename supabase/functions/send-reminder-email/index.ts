
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set");
}
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderEmailRequest {
  email: string;
  personName: string;
  eventType: "birthday" | "anniversary" | "welcome";
  eventDate: string;
  daysUntil: number;
  customMessage: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Received email request");

  try {
    // Parse request body
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    const { email, personName, eventType, eventDate, daysUntil, customMessage }: ReminderEmailRequest = body;

    // Validate required fields
    if (!email) {
      throw new Error("Email is required");
    }

    // Check if we're in testing mode
    // For Resend, when you're in test mode, you can only send to the verified email
    const ownerEmail = Deno.env.get("RESEND_OWNER_EMAIL") || "gujjamanichandan@gmail.com";
    
    // Use the owner's email as the recipient in test mode
    const testModeRecipient = ownerEmail;
    const finalRecipient = testModeRecipient;
    
    console.log(`Preparing to send ${eventType} email to ${finalRecipient} for ${personName}`);
    console.log(`Original recipient was: ${email}`);

    // Welcome email template
    if (eventType === "welcome") {
      console.log("Sending welcome email");
      try {
        const emailResponse = await resend.emails.send({
          from: "Cheerful Reminder <onboarding@resend.dev>",
          to: [finalRecipient],
          subject: `Welcome to Cheerful Reminder!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h1 style="color: #3b82f6; text-align: center;">
                Welcome to Cheerful Reminder!
              </h1>
              <p style="font-size: 18px;">
                Hello ${personName},
              </p>
              <p style="font-size: 16px;">
                ${customMessage}
              </p>
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <p style="font-size: 16px; margin: 0;">
                  <strong>Get Started:</strong><br>
                  1. Add important birthdays and anniversaries<br>
                  2. Set notification timings<br>
                  3. Relax knowing you'll never miss an important date
                </p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 14px; color: #6b7280;">
                  Thank you for joining Cheerful Reminder!
                </p>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                  This email was sent to: ${email} (redirected to ${finalRecipient} in test mode)
                </p>
              </div>
            </div>
          `,
        });

        console.log("Welcome email sent successfully:", JSON.stringify(emailResponse));

        return new Response(JSON.stringify({
          success: true,
          originalRecipient: email,
          actualRecipient: finalRecipient,
          message: "Email sent successfully in test mode"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (emailError: any) {
        console.error("Error sending welcome email:", emailError);
        throw new Error(`Failed to send welcome email: ${emailError.message}`);
      }
    }

    // Standard reminder email
    console.log("Sending reminder email");
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
    
    try {
      const emailResponse = await resend.emails.send({
        from: "Cheerful Reminder <onboarding@resend.dev>",
        to: [finalRecipient],
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
                This is an automated reminder from your Cheerful Reminder App.
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                This email was sent to: ${email} (redirected to ${finalRecipient} in test mode)
              </p>
            </div>
          </div>
        `,
      });

      console.log("Email sent successfully:", JSON.stringify(emailResponse));

      return new Response(JSON.stringify({
        success: true,
        originalRecipient: email,
        actualRecipient: finalRecipient,
        message: "Email sent successfully in test mode"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("Error sending reminder email:", emailError);
      throw new Error(`Failed to send reminder email: ${emailError.message}`);
    }
  } catch (error: any) {
    console.error("Error in send-reminder-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: "Check the function logs for more information"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
