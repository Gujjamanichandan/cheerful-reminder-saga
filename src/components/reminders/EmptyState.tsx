
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  type?: "all" | "birthday" | "anniversary";
  filtered?: boolean;
}

export function EmptyState({ type = "all", filtered = false }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed border-muted">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <CalendarPlus className="h-6 w-6 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-medium">
        {filtered 
          ? "No matching reminders found" 
          : type === "all" 
            ? "No reminders yet" 
            : type === "birthday" 
              ? "No birthdays yet" 
              : "No anniversaries yet"}
      </h3>
      
      <p className="text-sm text-muted-foreground text-center max-w-xs mt-1 mb-4">
        {filtered 
          ? "Try adjusting your filter criteria"
          : type === "all" 
            ? "Start creating reminders for important dates and never forget a special occasion again."
            : type === "birthday"
              ? "Add your first birthday reminder to make sure you never miss a celebration."
              : "Add your first anniversary reminder to celebrate special milestones."}
      </p>
      
      {!filtered && (
        <Button
          onClick={() => navigate("/create-reminder")}
          className="bg-celebration hover:bg-celebration/90"
        >
          Add Your First {type === "all" ? "Reminder" : type === "birthday" ? "Birthday" : "Anniversary"}
        </Button>
      )}
    </div>
  );
}
