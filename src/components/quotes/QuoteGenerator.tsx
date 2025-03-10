
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import QuoteForm from "./QuoteForm";
import QuoteDisplay from "./QuoteDisplay";
import ErrorDisplay from "./ErrorDisplay";
import { QuoteGeneratorProps, QuoteTopic, QuoteTone, QuoteLength } from "./types";

const QuoteGenerator = ({ 
  defaultTopic = "birthday", 
  onSelectQuote,
  compact = false,
  onClose 
}: QuoteGeneratorProps) => {
  const { toast } = useToast();
  const [topic, setTopic] = useState<QuoteTopic>(defaultTopic);
  const [relationship, setRelationship] = useState("");
  const [tone, setTone] = useState<QuoteTone>("heartfelt");
  const [length, setLength] = useState<QuoteLength>("medium");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Generating quote with params:", { topic, relationship, tone, length });
      
      const { data, error: funcError } = await supabase.functions.invoke("generate-quotes", {
        body: { topic, relationship, tone, length },
      });

      if (funcError) {
        console.error("Function invocation error:", funcError);
        throw new Error(funcError.message || "Error calling quote generator function");
      }
      
      console.log("Response from function:", data);
      
      if (data?.error) {
        console.error("Error from function:", data.error);
        throw new Error(data.error);
      }
      
      if (!data || !data.quote) {
        console.error("Invalid response data:", data);
        throw new Error("Received invalid response from quote generator");
      }
      
      setQuote(data.quote);
    } catch (error: any) {
      console.error("Error generating quote:", error);
      setError(error.message || "Failed to generate quote. Please try again.");
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

  return compact ? (
    <div className="space-y-3">
      <QuoteForm
        topic={topic}
        setTopic={setTopic}
        relationship={relationship}
        setRelationship={setRelationship}
        tone={tone}
        setTone={setTone}
        length={length}
        setLength={setLength}
        loading={loading}
        generateQuote={generateQuote}
        compact={compact}
      />
      
      <ErrorDisplay error={error} compact={compact} />
      
      <QuoteDisplay
        quote={quote}
        copied={copied}
        copyToClipboard={copyToClipboard}
        onSelectQuote={onSelectQuote}
        compact={compact}
        onClose={onClose}
      />
    </div>
  ) : (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Quote Generator
        </CardTitle>
        <CardDescription>
          Generate the perfect message for your special occasions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <QuoteForm
          topic={topic}
          setTopic={setTopic}
          relationship={relationship}
          setRelationship={setRelationship}
          tone={tone}
          setTone={setTone}
          length={length}
          setLength={setLength}
          loading={loading}
          generateQuote={generateQuote}
          compact={compact}
        />
        
        <ErrorDisplay error={error} compact={compact} />
        
        <QuoteDisplay
          quote={quote}
          copied={copied}
          copyToClipboard={copyToClipboard}
          onSelectQuote={onSelectQuote}
          compact={compact}
          onClose={onClose}
        />
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Powered by Deepseek AI to help you express your feelings.
      </CardFooter>
    </Card>
  );
};

export default QuoteGenerator;
