
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Gift,
  Heart,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { addDays, format, isSameDay } from "date-fns";
import { supabase, type Reminder } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Fetch user's reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: async (): Promise<Reminder[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false);
      
      if (error) {
        console.error('Error fetching reminders:', error);
        return [];
      }
      
      return data as Reminder[];
    },
    enabled: !!user,
  });

  // Transform reminder dates to Date objects
  const reminderDates = reminders.map(reminder => {
    // Extract month and day from the date (ignoring year)
    const [year, month, day] = reminder.date.split('-').map(Number);
    // Use current year for highlighting purposes
    const currentYear = new Date().getFullYear();
    return {
      date: new Date(currentYear, month - 1, day),
      name: reminder.person_name,
      type: reminder.type
    };
  });

  // Function to check if a date has reminders
  const isReminderDate = (date: Date) => {
    return reminderDates.some(reminder => 
      isSameDay(date, reminder.date)
    );
  };

  // Function to get reminder details for a specific date
  const getReminderDetails = (date: Date) => {
    return reminderDates.filter(reminder => 
      isSameDay(date, reminder.date)
    );
  };

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Birthdays",
      path: "/birthdays",
      icon: Gift,
    },
    {
      name: "Anniversaries",
      path: "/anniversaries",
      icon: Heart,
    },
    {
      name: "Calendar",
      path: "/calendar",
      icon: CalendarIcon,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="grid gap-2 py-6 px-4">
                <div className="flex items-center gap-2 mb-6">
                  <Gift className="h-6 w-6 text-celebration" />
                  <span className="text-lg font-semibold">Cheerful Reminder</span>
                </div>
                <nav className="grid gap-1">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
                        isActive(route.path)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <route.icon className="h-4 w-4" />
                      {route.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Link to="/dashboard" className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-celebration hidden md:block" />
          <span className="font-semibold text-lg hidden md:block">Cheerful Reminder</span>
        </Link>
        
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
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="p-3 pointer-events-auto"
                      components={{
                        Day: ({ date, ...props }) => {
                          // Check if date has reminders
                          const hasReminders = isReminderDate(date);
                          const reminders = getReminderDetails(date);
                          
                          return (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  {...props}
                                  className={cn(
                                    props.className,
                                    hasReminders && 'bg-celebration text-celebration-foreground hover:bg-celebration/90'
                                  )}
                                />
                              </TooltipTrigger>
                              {hasReminders && (
                                <TooltipContent side="right" className="p-2 max-w-xs">
                                  <div className="space-y-1">
                                    {reminders.map((reminder, i) => (
                                      <p key={i} className="text-sm">
                                        {reminder.name} - {reminder.type === 'birthday' ? 'Birthday' : 'Anniversary'}
                                      </p>
                                    ))}
                                  </div>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          );
                        }
                      }}
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
        
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex gap-1 items-center"
            onClick={() => navigate("/create-reminder")}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            New Reminder
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate("/sign-in")}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
}
