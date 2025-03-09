
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  routes: Array<{
    name: string;
    path: string;
    icon: React.ElementType;
  }>;
  isActive: (path: string) => boolean;
}

export function DesktopNav({ routes, isActive }: DesktopNavProps) {
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:flex">
      {routes.map((route) => (
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
      ))}
    </nav>
  );
}
