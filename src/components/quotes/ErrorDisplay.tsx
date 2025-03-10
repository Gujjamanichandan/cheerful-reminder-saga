
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ErrorDisplayProps } from "./types";

const ErrorDisplay = ({ error, compact = false }: ErrorDisplayProps) => {
  if (!error) return null;
  
  return compact ? (
    <Alert variant="destructive" className="py-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-xs">{error}</AlertDescription>
    </Alert>
  ) : (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
