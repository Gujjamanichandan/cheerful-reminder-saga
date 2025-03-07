
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
import { CalendarPlus, Heart, Search } from "lucide-react";

const Anniversaries = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [anniversaries, setAnniversaries] = useState<Reminder[]>([]);
  const [filteredAnniversaries, setFilteredAnniversaries] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAnniversaries();
    }
  }, [user]);

  useEffect(() => {
    if (anniversaries.length > 0) {
      filterAnniversaries();
    } else {
      setFilteredAnniversaries([]);
    }
  }, [anniversaries, searchQuery]);

  const fetchAnniversaries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "anniversary")
        .eq("archived", false)
        .order("date", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setAnniversaries(data as Reminder[]);
    } catch (error: any) {
      console.error("Error fetching anniversaries:", error);
      toast({
        title: "Error",
        description: "Failed to load your anniversaries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAnniversaries = () => {
    if (searchQuery.trim() === "") {
      setFilteredAnniversaries(anniversaries);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = anniversaries.filter((anniversary) =>
      anniversary.person_name.toLowerCase().includes(query) ||
      anniversary.relationship.toLowerCase().includes(query)
    );
    
    setFilteredAnniversaries(filtered);
  };

  const handleDelete = () => {
    fetchAnniversaries();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-anniversary-subtle flex items-center justify-center">
              <Heart className="h-5 w-5 text-anniversary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Anniversaries</h1>
              <p className="text-muted-foreground">
                Celebrate special milestones and memories
              </p>
            </div>
          </div>
          
          <Button 
            className="bg-anniversary hover:bg-anniversary/90"
            onClick={() => navigate("/create-reminder", { state: { type: "anniversary" } })}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add Anniversary
          </Button>
        </div>
        
        <div className="bg-background rounded-lg border shadow-sm p-4 md:p-6">
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anniversaries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-pulse">Loading anniversaries...</div>
              </div>
            ) : filteredAnniversaries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnniversaries.map((anniversary) => (
                  <ReminderCard 
                    key={anniversary.id} 
                    reminder={anniversary}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                type="anniversary"
                filtered={searchQuery.trim() !== "" && anniversaries.length > 0}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Anniversaries;
