"use client"; // Required for usePathname

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { HomeIcon, FolderKanbanIcon, LightbulbIcon, SettingsIcon } from 'lucide-react'; // Example icons

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { href: "/projects", label: "Projects", icon: FolderKanbanIcon },
  { href: "/prompts", label: "Prompts", icon: LightbulbIcon },
  // Add more items like Settings if needed
  // { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // The parent ResizablePanel will control the width.
    // Use h-full to fill the height of the panel.
    // bg-sidebar (from globals, or a specific class like bg-slate-50 dark:bg-slate-900)
    // border-r border-sidebar-border (from globals or e.g. border-slate-200 dark:border-slate-800)
    <div className="h-full flex flex-col p-3 space-y-6 bg-inherit text-inherit">
      {/* Logo or App Name Area - optional */}
      <div className="px-3 py-2">
        <h1 className="text-xl font-semibold text-primary">MyApp</h1>
      </div>

      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"} // "secondary" for active, "ghost" for others
              className="w-full justify-start text-sm h-9" // Slightly smaller height, consistent text size
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-3 h-4 w-4 text-muted-foreground" /> {/* Icon styling */}
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Optional: User/Account section at the bottom of sidebar (if not in header) */}
      {/* <div className="mt-auto p-2">
        User Info / Settings Link
      </div> */}
    </div>
  );
}
