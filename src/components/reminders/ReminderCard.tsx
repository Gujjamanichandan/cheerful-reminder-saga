
import { useState } from "react";
import { format, differenceInDays, addYears, isBefore } from "date-fns";
import { CalendarIcon, Gift, Heart, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Reminder, supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: () => void;
}

export function ReminderCard({ reminder, onDelete }: ReminderCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    id, 
    person_name, 
    type, 
    date, 
    relationship,
    archived,
  } = reminder;

  // Calculate next occurrence
  const calculateNextOccurrence = () => {
    const originalDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let nextDate = new Date(originalDate);
    nextDate.setFullYear(today.getFullYear());

    // If this year's date has passed, calculate for next year
    if (isBefore(nextDate, today)) {
      nextDate = addYears(nextDate, 1);
    }

    const daysUntil = differenceInDays(nextDate, today);
    return { nextDate, daysUntil };
  };

  const { nextDate, daysUntil } = calculateNextOccurrence();

  // Calculate which year this will be
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const calculateYearNumber = () => {
    if (type !== "anniversary") return null;
    
    const originalDate = new Date(date);
    const nextOccurence = nextDate;
    return nextOccurence.getFullYear() - originalDate.getFullYear();
  };

  const yearNumber = calculateYearNumber();

  const getRelationshipLabel = () => {
    switch (relationship) {
      case "family": return "Family";
      case "friend": return "Friend";
      case "partner": return "Partner/Spouse";
      case "colleague": return "Colleague";
      default: return "Other";
    }
  };

  const handleEdit = () => {
    navigate(`/edit-reminder/${id}`);
  };

  const handleArchive = async () => {
    try {
      setIsArchiving(true);
      const { error } = await supabase
        .from("reminders")
        .update({ archived: !archived })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: archived ? "Reminder Unarchived" : "Reminder Archived",
        description: `${type === "birthday" ? "Birthday" : "Anniversary"} reminder for ${person_name} has been ${archived ? "unarchived" : "archived"}.`,
      });
      
      onDelete(); // This will refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to archive reminder",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Reminder Deleted",
        description: `${type === "birthday" ? "Birthday" : "Anniversary"} reminder for ${person_name} has been deleted.`,
      });
      
      onDelete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete reminder",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      type === "birthday" ? "border-birthday/30" : "border-anniversary/30",
      archived ? "opacity-60" : ""
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Avatar className={cn(
            type === "birthday" ? "bg-birthday-subtle text-birthday" : "bg-anniversary-subtle text-anniversary"
          )}>
            <AvatarFallback>
              {type === "birthday" ? <Gift size={16} /> : <Heart size={16} />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{person_name}</h3>
            <p className="text-xs text-muted-foreground">{getRelationshipLabel()}</p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              {archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive" 
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm space-x-1">
            <CalendarIcon className="h-3.5 w-3.5 opacity-70 mr-1" />
            <span>{format(new Date(date), "MMMM d")}</span>
            {yearNumber && (
              <span className="opacity-70">
                ({getOrdinal(yearNumber)}{type === "anniversary" ? " anniversary" : ""})
              </span>
            )}
          </div>
          
          <Badge 
            variant="outline" 
            className={cn(
              "w-fit",
              daysUntil === 0 
                ? "bg-celebration-subtle text-celebration border-celebration/30" 
                : daysUntil <= 7
                ? (type === "birthday" ? "bg-birthday-subtle text-birthday border-birthday/30" : "bg-anniversary-subtle text-anniversary border-anniversary/30")
                : ""
            )}
          >
            {daysUntil === 0 
              ? "Today!" 
              : daysUntil === 1 
              ? "Tomorrow" 
              : `In ${daysUntil} days`}
          </Badge>

          {type === "anniversary" && yearNumber && yearNumber % 5 === 0 && (
            <Badge variant="outline" className="w-fit bg-celebration-subtle text-celebration border-celebration/30 mt-1">
              Milestone Year!
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Next: {format(nextDate, "MMMM d, yyyy")}
          </p>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              type === "birthday" 
                ? "text-birthday hover:bg-birthday-subtle hover:text-birthday" 
                : "text-anniversary hover:bg-anniversary-subtle hover:text-anniversary"
            )}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
