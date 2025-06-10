"use client"; // Required for useSession and useRouter

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {/* Consider a more styled loader later */}
        <p className="text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  return (
    // Main layout container using flex to ensure sidebar and content are side-by-side
    // The ResizablePanelGroup itself is a flex container.
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen bg-background text-foreground"
    >
      <ResizablePanel
        defaultSize={18} // Slightly narrower sidebar by default
        minSize={12}
        maxSize={25}
        className="hidden md:block bg-sidebar border-r border-sidebar-border" // Use sidebar specific colors if defined, else fallback
      >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle withHandle className="hidden md:flex bg-border hover:bg-primary/10 transition-colors" />
      <ResizablePanel defaultSize={82}>
        <div className="flex flex-col h-full">
          <Header />
          {/* Main content area with consistent padding */}
          {/* bg-muted/40 changed to bg-background or a very light gray like bg-slate-50 if needed */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
