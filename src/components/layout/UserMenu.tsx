
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, PlusCircle, Settings } from "lucide-react";

interface UserMenuProps {
  user: any;
  signOut: () => Promise<void>;
}

export function UserMenu({ user, signOut }: UserMenuProps) {
  const navigate = useNavigate();
  const initials = user?.email?.substring(0, 2).toUpperCase() || "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
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
  );
}
