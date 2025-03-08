
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gift, Heart, Home, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Reminder } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

  const reminderDates = reminders.map(reminder => {
    const [year, month, day] = reminder.date.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    return {
      date: new Date(currentYear, month - 1, day),
      name: reminder.person_name,
      type: reminder.type
    };
  });

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <MobileNav 
            routes={routes} 
            isActive={isActive} 
            open={open} 
            setOpen={setOpen} 
          />
        </div>

        <Link to="/dashboard" className="flex items-center gap-2">
          <Gift className="h-6 w-6 text-celebration hidden md:block" />
          <span className="font-semibold text-lg hidden md:block">Cheerful Reminder</span>
        </Link>
        
        <DesktopNav 
          routes={routes} 
          isActive={isActive} 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          reminderDates={reminderDates} 
        />
        
        <UserMenu user={user} signOut={signOut} />
      </div>
    </header>
  );
}
