
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
      console.error("DEEPSEEK_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "API key configuration issue. Please contact support." }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 500,
        }
      );
    }
    
    // Parse the request body safely
    let reqBody;
    try {
      reqBody = await req.json() as QuoteRequest;
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        }
      );
    }
    
    const { topic, relationship, tone, length } = reqBody;
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        }
      );
    }
    
    // Construct the prompt
    let prompt = `Generate a ${length || "medium-length"} ${tone || "heartfelt"} quote for a ${topic}`;
    
    if (relationship) {
      prompt += ` for my ${relationship}`;
    }
    
    prompt += `. The quote should be meaningful, original, and appropriate for the occasion.`;
    
    console.log("Sending prompt to Deepseek API:", prompt);
    
    // Prepare API request
    const requestBody = JSON.stringify({
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
    });
    
    console.log("Request body:", requestBody);
    
    // Call Deepseek API with proper error handling
    let response;
    try {
      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to connect to AI service. Please try again later." }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 503,
        }
      );
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepseek API error response:", errorText);
      return new Response(
        JSON.stringify({ error: "AI service returned an error. Please try again later." }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 502,
        }
      );
    }
    
    // Parse JSON response safely
    let data;
    try {
      data = await response.json();
      console.log("Deepseek API response:", JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return new Response(
        JSON.stringify({ error: "Received invalid response from AI service" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 502,
        }
      );
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected Deepseek API response structure:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Received unexpected response format from AI service" }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 502,
        }
      );
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
    console.error("Uncaught error in generate-quotes function:", error);
    
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
