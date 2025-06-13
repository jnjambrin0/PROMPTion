import { GuideNavigation } from './components/guide-navigation'

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <GuideNavigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  )
} 