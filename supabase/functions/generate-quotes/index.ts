
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  topic: "birthday" | "anniversary";
  relationship?: string;
  tone?: string;
  length?: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not set in environment variables");
    }
    
    const { topic, relationship, tone, length } = await req.json() as QuoteRequest;
    
    if (!topic) {
      throw new Error("Topic is required");
    }
    
    // Construct the prompt
    let prompt = `Generate a ${length || "medium-length"} ${tone || "heartfelt"} quote for a ${topic}`;
    
    if (relationship) {
      prompt += ` for my ${relationship}`;
    }
    
    prompt += `. The quote should be meaningful, original, and appropriate for the occasion.`;
    
    console.log("Sending prompt to Deepseek API:", prompt);
    
    // Call Deepseek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional writer specializing in creating heartfelt and meaningful quotes for special occasions. You write only the quote itself without any additional commentary or explanation."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepseek API error response:", errorText);
      throw new Error(`Deepseek API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected Deepseek API response structure:", JSON.stringify(data));
      throw new Error("Unexpected response structure from Deepseek API");
    }
    
    const quote = data.choices[0].message.content;
    
    console.log("Generated quote:", quote);
    
    return new Response(
      JSON.stringify({ quote }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating quote:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
