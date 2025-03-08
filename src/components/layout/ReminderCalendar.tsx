
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { type Reminder } from "@/lib/supabase";

interface ReminderCalendarProps {
  reminders: Array<{
    date: Date;
    name: string;
    type: string;
  }>;
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export function ReminderCalendar({ reminders, selectedDate, onDateSelect }: ReminderCalendarProps) {
  const isReminderDate = (date: Date) => {
    return reminders.some(reminder => 
      isSameDay(date, reminder.date)
    );
  };

  const getReminderDetails = (date: Date) => {
    return reminders.filter(reminder => 
      isSameDay(date, reminder.date)
    );
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onDateSelect}
      className="p-3"
      modifiers={{
        hasReminder: (date) => isReminderDate(date)
      }}
      modifiersClassNames={{
        hasReminder: "bg-celebration text-celebration-foreground hover:bg-celebration/90"
      }}
      components={{
        Day: (props) => {
          // Check if this is a date cell or a header/footer cell
          if ('displayMonth' in props && !('date' in props)) {
            // This is not a date cell, just return the default rendering
            return <button type="button" {...props} />;
          }

          // Now we know it's a date cell with a date property
          const dayProps = props as React.ButtonHTMLAttributes<HTMLButtonElement> & { date: Date };
          const { date, className, ...rest } = dayProps;
          
          if (!date) return null;
          
          const hasReminders = isReminderDate(date);
          const reminderItems = getReminderDetails(date);
          
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    {...rest}
                    className={cn(
                      className,
                      hasReminders && 'bg-celebration text-celebration-foreground hover:bg-celebration/90'
                    )}
                  />
                </TooltipTrigger>
                {hasReminders && (
                  <TooltipContent side="right" className="p-2 max-w-xs">
                    <div className="space-y-1">
                      {reminderItems.map((reminder, i) => (
                        <p key={i} className="text-sm">
                          {reminder.name} - {reminder.type === 'birthday' ? 'Birthday' : 'Anniversary'}
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        }
      }}
    />
  );
}
