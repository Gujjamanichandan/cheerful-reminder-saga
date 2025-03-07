
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { EmptyState } from "@/components/reminders/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase, Reminder } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, Gift, Search } from "lucide-react";

const Birthdays = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [birthdays, setBirthdays] = useState<Reminder[]>([]);
  const [filteredBirthdays, setFilteredBirthdays] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBirthdays();
    }
  }, [user]);

  useEffect(() => {
    if (birthdays.length > 0) {
      filterBirthdays();
    } else {
      setFilteredBirthdays([]);
    }
  }, [birthdays, searchQuery]);

  const fetchBirthdays = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "birthday")
        .eq("archived", false)
        .order("date", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setBirthdays(data as Reminder[]);
    } catch (error: any) {
      console.error("Error fetching birthdays:", error);
      toast({
        title: "Error",
        description: "Failed to load your birthdays. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterBirthdays = () => {
    if (searchQuery.trim() === "") {
      setFilteredBirthdays(birthdays);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = birthdays.filter((birthday) =>
      birthday.person_name.toLowerCase().includes(query) ||
      birthday.relationship.toLowerCase().includes(query)
    );
    
    setFilteredBirthdays(filtered);
  };

  const handleDelete = () => {
    fetchBirthdays();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-birthday-subtle flex items-center justify-center">
              <Gift className="h-5 w-5 text-birthday" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Birthdays</h1>
              <p className="text-muted-foreground">
                Never miss a birthday celebration
              </p>
            </div>
          </div>
          
          <Button 
            className="bg-birthday hover:bg-birthday/90"
            onClick={() => navigate("/create-reminder", { state: { type: "birthday" } })}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Birthday
          </Button>
        </div>
        
        <div className="bg-background rounded-lg border shadow-sm p-4 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search birthdays..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse">Loading birthdays...</div>
              </div>
            ) : filteredBirthdays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBirthdays.map((birthday) => (
                  <ReminderCard 
                    key={birthday.id} 
                    reminder={birthday}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type="birthday"
                filtered={searchQuery.trim() !== "" && birthdays.length > 0}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Birthdays;
