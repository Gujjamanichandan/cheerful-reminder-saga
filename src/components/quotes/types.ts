
import { ReactNode } from "react";

export type QuoteTopic = "birthday" | "anniversary";
export type QuoteTone = "heartfelt" | "funny" | "inspirational" | "romantic";
export type QuoteLength = "short" | "medium" | "long";

export interface QuoteGeneratorProps {
  defaultTopic?: QuoteTopic;
  onSelectQuote?: (quote: string) => void;
  compact?: boolean;
  onClose?: () => void;
}

export interface QuoteFormProps {
  topic: QuoteTopic;
  setTopic: (topic: QuoteTopic) => void;
  relationship: string;
  setRelationship: (relationship: string) => void;
  tone: QuoteTone;
  setTone: (tone: QuoteTone) => void;
  length: QuoteLength;
  setLength: (length: QuoteLength) => void;
  loading: boolean;
  generateQuote: () => Promise<void>;
  compact?: boolean;
}

export interface QuoteDisplayProps {
  quote: string;
  copied: boolean;
  copyToClipboard: () => void;
  onSelectQuote?: (quote: string) => void;
  compact?: boolean;
  onClose?: () => void;
}

export interface ErrorDisplayProps {
  error: string | null;
  compact?: boolean;
}
