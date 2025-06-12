'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Shield, Bell, CreditCard, Building, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const settingsTabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    description: 'Manage your personal information'
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
    description: 'Configure notification preferences'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: CreditCard,
    description: 'Manage subscription and billing'
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    icon: Building,
    description: 'Manage your workspaces'
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Settings,
    description: 'Privacy and data settings'
  }
]

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-gray-600">
          Update your personal information and how others see you.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Your full name" />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="@username" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" />
        </div>
        
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="https://yourwebsite.com" />
        </div>
        
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-gray-600">
          Configure how you receive notifications.
        </p>
      </div>
      
      <Separator />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Email Notifications</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Comments</Label>
                <p className="text-sm text-gray-600">Get notified when someone comments on your prompts</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Mentions</Label>
                <p className="text-sm text-gray-600">Get notified when someone mentions you</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Summary</Label>
                <p className="text-sm text-gray-600">Get a weekly summary of your activity</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">Push Notifications</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Real-time Updates</Label>
                <p className="text-sm text-gray-600">Get instant notifications for important updates</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
        
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-gray-600">
          Manage your subscription and billing information.
        </p>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Free Plan</span>
              <span className="font-semibold">$0/month</span>
            </div>
            <Button variant="outline" className="w-full">Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GenericTab({ tabId }: { tabId: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium capitalize">{tabId}</h3>
        <p className="text-sm text-gray-600">
          {tabId === 'account' && 'Manage your account security settings.'}
          {tabId === 'workspaces' && 'Manage your workspaces and team settings.'}
          {tabId === 'privacy' && 'Control your privacy and data preferences.'}
        </p>
      </div>
      
      <Separator />
      
      <div className="text-center py-8">
        <p className="text-gray-500">This section is coming soon.</p>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'notifications':
        return <NotificationsTab />
      case 'billing':
        return <BillingTab />
      default:
        return <GenericTab tabId={activeTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-sm transition-colors text-left ${
                      isActive 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${
                        isActive ? 'text-gray-900' : 'text-gray-900'
                      }`}>
                        {tab.label}
                      </div>
                      <div className={`mt-1 ${
                        isActive ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 