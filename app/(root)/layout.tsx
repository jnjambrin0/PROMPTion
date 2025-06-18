import { Topbar } from '@/components/layout/topbar'
import { Sidebar } from '@/components/layout/sidebar'
import { RightSidebar } from '@/components/layout/right-sidebar'
import { Toaster } from '@/components/ui/sonner'
import { LegalFooter } from '@/components/legal/legal-footer'
import { CookieBanner } from '@/components/legal/cookie-banner'

// Force dynamic rendering for authenticated layout
export const dynamic = 'force-dynamic'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Left Sidebar - Full height, hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content area - Topbar and content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        
        <div className="flex flex-1 min-h-0">
          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full overflow-y-auto">
            {children}
            <CookieBanner />
            <LegalFooter />
          </main>
          
          {/* Right Sidebar - Hidden on mobile and tablet */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </div>
      
      {/* Sonner Toaster for notifications */}
      <Toaster position="bottom-right" />
    </div>
  )
}
