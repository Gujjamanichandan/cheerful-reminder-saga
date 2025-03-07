
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { EmptyState } from "@/components/reminders/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase, Reminder } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, Search } from "lucide-react";

const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, isAuthLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  useEffect(() => {
    if (reminders.length > 0) {
      filterReminders();
    } else {
      setFilteredReminders([]);
    }
  }, [reminders, activeTab, searchQuery]);

  const fetchReminders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("date", { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setReminders(data as Reminder[]);
    } catch (error: any) {
      console.error("Error fetching reminders:", error);
      toast({
        title: "Error",
        description: "Failed to load your reminders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterReminders = () => {
    let filtered = [...reminders];
    
    // Filter by type
    if (activeTab !== "all") {
      filtered = filtered.filter((reminder) => reminder.type === activeTab);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((reminder) =>
        reminder.person_name.toLowerCase().includes(query) ||
        reminder.relationship.toLowerCase().includes(query)
      );
    }
    
    setFilteredReminders(filtered);
  };

  const handleDelete = () => {
    fetchReminders();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Reminders</h1>
            <p className="text-muted-foreground">
              Keep track of all your important celebrations
            </p>
          </div>
          
          <Button 
            className="bg-celebration hover:bg-celebration/90"
            onClick={() => navigate("/create-reminder")}
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Add New Reminder
          </Button>
        </div>
        
        <div className="bg-background rounded-lg border shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Tabs 
              defaultValue="all" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="birthday">Birthdays</TabsTrigger>
                <TabsTrigger value="anniversary">Anniversaries</TabsTrigger>
              </TabsList>
              
              <div className="flex w-full gap-4">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reminders..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <TabsContent value="all" className="m-0">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-pulse">Loading reminders...</div>
                  </div>
                ) : filteredReminders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReminders.map((reminder) => (
                      <ReminderCard 
                        key={reminder.id} 
                        reminder={reminder}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    type="all"
                    filtered={searchQuery.trim() !== "" || reminders.length > 0}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="birthday" className="m-0">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-pulse">Loading birthdays...</div>
                  </div>
                ) : filteredReminders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReminders.map((reminder) => (
                      <ReminderCard 
                        key={reminder.id} 
                        reminder={reminder}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    type="birthday"
                    filtered={searchQuery.trim() !== "" || reminders.some(r => r.type === "birthday")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="anniversary" className="m-0">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-pulse">Loading anniversaries...</div>
                  </div>
                ) : filteredReminders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReminders.map((reminder) => (
                      <ReminderCard 
                        key={reminder.id} 
                        reminder={reminder}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    type="anniversary"
                    filtered={searchQuery.trim() !== "" || reminders.some(r => r.type === "anniversary")}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
