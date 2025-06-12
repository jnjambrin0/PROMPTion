import { Topbar } from '@/components/layout/topbar'
import { Sidebar } from '@/components/layout/sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      
      <div className="flex">
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Main Content - Full width on mobile, centered on desktop */}
        <main className="flex-1 min-w-0 w-full">
          {children}
        </main>
        
        {/* Right Sidebar - Hidden on mobile and tablet */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}
