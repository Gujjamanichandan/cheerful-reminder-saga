
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageCircle, X, Sparkles } from "lucide-react";
import QuoteGenerator from "./QuoteGenerator";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-lg border-primary/20 animate-in slide-in-from-right-10 duration-300">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">AI Quote Generator</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)} 
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 max-h-[70vh] overflow-y-auto">
            <div className="p-4">
              <QuoteGenerator 
                defaultTopic="birthday" 
                compact={true} 
                onClose={() => setIsOpen(false)}
              />
            </div>
          </CardContent>
          <CardFooter className="py-2 px-4 border-t text-xs text-muted-foreground">
            Powered by Deepseek AI
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-12 w-12 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default ChatBox;
