
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { QuoteFormProps, QuoteTone, QuoteLength, QuoteTopic } from "./types";

const QuoteForm = ({
  topic,
  setTopic,
  relationship,
  setRelationship,
  tone,
  setTone,
  length,
  setLength,
  loading,
  generateQuote,
  compact = false
}: QuoteFormProps) => {
  
  return compact ? (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <Select 
          value={topic} 
          onValueChange={(value: QuoteTopic) => setTopic(value)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthday">Birthday</SelectItem>
            <SelectItem value="anniversary">Anniversary</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={tone} onValueChange={(value: QuoteTone) => setTone(value)}>
          <SelectTrigger className="flex-1">
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
      
      <div className="flex gap-2">
        <Input
          id="relationship"
          placeholder="Relationship (e.g., friend, spouse)"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="flex-1"
        />
        
        <Select 
          value={length} 
          onValueChange={(value: QuoteLength) => setLength(value)}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Length" />
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
        size="sm"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-3 w-3" />
            Generate Quote
          </>
        )}
      </Button>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="topic">Occasion</Label>
        <Select 
          value={topic} 
          onValueChange={(value: QuoteTopic) => setTopic(value)}
        >
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
        <Select 
          value={tone} 
          onValueChange={(value: QuoteTone) => setTone(value)}
        >
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
        <Select 
          value={length} 
          onValueChange={(value: QuoteLength) => setLength(value)}
        >
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
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Quote
          </>
        )}
      </Button>
    </div>
  );
};

export default QuoteForm;
