
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuoteGeneratorProps {
  defaultTopic?: "birthday" | "anniversary";
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ defaultTopic = "birthday" }) => {
  const { toast } = useToast();
  const [topic, setTopic] = useState<"birthday" | "anniversary">(defaultTopic);
  const [relationship, setRelationship] = useState("");
  const [tone, setTone] = useState("heartfelt");
  const [length, setLength] = useState("medium");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateQuote = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quotes", {
        body: { topic, relationship, tone, length },
      });

      if (error) throw error;
      setQuote(data.quote);
    } catch (error) {
      console.error("Error generating quote:", error);
      toast({
        title: "Error generating quote",
        description: "There was a problem connecting to the AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote);
    setCopied(true);
    toast({
      title: "Quote copied to clipboard",
      description: "You can now paste it wherever you need.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">AI Quote Generator</CardTitle>
        <CardDescription>
          Generate the perfect message for your special occasions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Occasion</Label>
          <Select value={topic} onValueChange={(value: "birthday" | "anniversary") => setTopic(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Birthday</SelectItem>
              <SelectItem value="anniversary">Anniversary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="relationship">Relationship (optional)</Label>
          <Input
            id="relationship"
            placeholder="e.g., friend, spouse, sister"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="heartfelt">Heartfelt</SelectItem>
              <SelectItem value="funny">Funny</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="romantic">Romantic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Select value={length} onValueChange={setLength}>
            <SelectTrigger>
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={generateQuote} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : "Generate Quote"}
        </Button>
        
        {quote && (
          <div className="mt-6 space-y-2">
            <Label>Your Generated Quote:</Label>
            <div className="relative">
              <Textarea 
                value={quote} 
                readOnly 
                className="h-[150px] resize-none"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Powered by AI to help you express your feelings.
      </CardFooter>
    </Card>
  );
};

export default QuoteGenerator;
