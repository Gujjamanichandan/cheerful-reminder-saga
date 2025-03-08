
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  routes: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
  }>;
  isActive: (path: string) => boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function MobileNav({ routes, isActive, open, setOpen }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="grid gap-2 py-6 px-4">
          <div className="flex items-center gap-2 mb-6">
            {routes[1] && <routes[1].icon className="h-6 w-6 text-celebration" />}
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
  );
}
