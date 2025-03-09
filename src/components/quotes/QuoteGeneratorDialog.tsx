
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import QuoteGenerator from "./QuoteGenerator";

interface QuoteGeneratorDialogProps {
  topic?: "birthday" | "anniversary";
  onSelectQuote: (quote: string) => void;
}

const QuoteGeneratorDialog = ({ 
  topic = "birthday", 
  onSelectQuote 
}: QuoteGeneratorDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleSelectQuote = (quote: string) => {
    onSelectQuote(quote);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Quote Generator</DialogTitle>
          <DialogDescription>
            Create the perfect message for your {topic} reminder with AI assistance.
          </DialogDescription>
        </DialogHeader>
        <QuoteGenerator 
          defaultTopic={topic} 
          onSelectQuote={handleSelectQuote} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteGeneratorDialog;
