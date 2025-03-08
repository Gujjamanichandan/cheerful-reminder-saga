
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReminderCalendar } from "./ReminderCalendar";

interface DesktopNavProps {
  routes: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
  }>;
  isActive: (path: string) => boolean;
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  reminderDates: Array<{
    date: Date;
    name: string;
    type: string;
  }>;
}

export function DesktopNav({ 
  routes, 
  isActive, 
  selectedDate, 
  setSelectedDate, 
  reminderDates 
}: DesktopNavProps) {
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
      {routes.map((route, index) => (
        index === routes.length - 1 ? (
          <TooltipProvider key={route.path}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center gap-1.5",
                    isActive(route.path)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.name}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-auto p-0">
                <ReminderCalendar 
                  reminders={reminderDates}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>
          </TooltipProvider>
        ) : (
          <Link
            key={route.path}
            to={route.path}
            className={cn(
              "text-sm font-medium transition-colors flex items-center gap-1.5",
              isActive(route.path)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.name}
          </Link>
        )
      ))}
    </nav>
  );
}
