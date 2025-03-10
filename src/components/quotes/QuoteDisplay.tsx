
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Check, Send } from "lucide-react";
import { QuoteDisplayProps } from "./types";

const QuoteDisplay = ({ 
  quote, 
  copied, 
  copyToClipboard, 
  onSelectQuote,
  compact = false,
  onClose
}: QuoteDisplayProps) => {
  
  const useQuote = () => {
    if (onSelectQuote) {
      onSelectQuote(quote);
      if (onClose) onClose();
    }
  };
  
  if (!quote) return null;
  
  return compact ? (
    <div className="space-y-2">
      <div className="relative bg-muted p-3 rounded-lg text-sm">
        <p className="pr-8">{quote}</p>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {onSelectQuote && (
        <Button 
          onClick={useQuote} 
          className="w-full" 
          variant="outline"
          size="sm"
        >
          <Send className="mr-2 h-3 w-3" />
          Use This Quote
        </Button>
      )}
    </div>
  ) : (
    <div className="mt-6 space-y-2">
      <Label>Your Generated Quote:</Label>
      <div className="relative">
        <Textarea 
          value={quote} 
          readOnly 
          className="h-[150px] resize-none pr-10"
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
      
      {onSelectQuote && (
        <Button 
          onClick={useQuote} 
          className="w-full mt-2" 
          variant="outline"
        >
          Use This Quote
        </Button>
      )}
    </div>
  );
};

export default QuoteDisplay;
