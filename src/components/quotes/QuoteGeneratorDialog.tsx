
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuoteGenerator from "./QuoteGenerator";
import { Sparkles } from "lucide-react";

interface QuoteGeneratorDialogProps {
  eventType: "birthday" | "anniversary";
  onQuoteSelected: (quote: string) => void;
}

const QuoteGeneratorDialog: React.FC<QuoteGeneratorDialogProps> = ({
  eventType,
  onQuoteSelected,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Generate AI Quote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Quote Generator</DialogTitle>
          <DialogDescription>
            Create the perfect {eventType} message with AI assistance
          </DialogDescription>
        </DialogHeader>
        <QuoteGenerator defaultTopic={eventType} />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteGeneratorDialog;
