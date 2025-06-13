'use client'

import { useState, useCallback } from 'react'
import { User, Shield, Bell, CreditCard, Building, Settings as SettingsIcon } from 'lucide-react'
import { 
  ProfileSettings, 
  NotificationSettings, 
  WorkspaceSettings, 
  PrivacySettings,
  AccountSettings,
  BillingSettings 
} from '@/components/settings'
import { getUserSettingsAction, type UserSettingsData } from '@/lib/actions/user-settings'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const settingsTabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Personal information and bio'
  },
  {
    id: 'account',
    label: 'Account',
    icon: Shield,
    description: 'Security and login settings'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Email and push preferences'
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    icon: Building,
    description: 'Membership and access'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Plans and subscription'
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: SettingsIcon,
    description: 'Data and visibility settings'
  }
]

interface SettingsClientProps {
  initialData: UserSettingsData
  userId: string
}

export function SettingsClient({ initialData, userId }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState('profile')
  const [settingsData, setSettingsData] = useState<UserSettingsData>(initialData)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshSettings = useCallback(async () => {
    setIsRefreshing(true)
    
    try {
      const result = await getUserSettingsAction()
      
      if (result.success && result.data) {
        setSettingsData(result.data)
      } else {
        toast.error('Failed to refresh settings')
      }
    } catch (error) {
      console.error('Error refreshing settings:', error)
      toast.error('Failed to refresh settings')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings 
            profile={settingsData.profile}
            onUpdate={refreshSettings}
          />
        )
      case 'notifications':
        return (
          <NotificationSettings 
            preferences={settingsData.notifications}
            onUpdate={refreshSettings}
          />
        )
      case 'workspaces':
        return (
          <WorkspaceSettings 
            workspaces={settingsData.workspaces}
            onUpdate={refreshSettings}
          />
        )
      case 'privacy':
        return (
          <PrivacySettings 
            settings={settingsData.privacy}
            onUpdate={refreshSettings}
          />
        )
      case 'account':
        return (
          <AccountSettings 
            userEmail={settingsData.profile.email}
            onUpdate={refreshSettings}
          />
        )
      case 'billing':
        return (
          <BillingSettings 
            onUpdate={refreshSettings}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account preferences and configuration
              </p>
            </div>
            
            {isRefreshing && (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <span className="text-sm text-muted-foreground">Syncing...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Compact Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-6">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left group ${
                      isActive 
                        ? 'bg-muted text-foreground' 
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className={`h-4 w-4 flex-shrink-0 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${
                        isActive ? 'text-foreground' : 'text-foreground'
                      }`}>
                        {tab.label}
                      </div>
                      <div className={`text-xs truncate ${
                        isActive ? 'text-muted-foreground' : 'text-muted-foreground'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-4">
            <div className="bg-card rounded-lg border border-border p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 