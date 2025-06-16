'use client'

import React from 'react'
import { CreditCard, Star, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SettingsSection } from './shared/settings-section'
import { SettingsRow } from './shared/settings-row'
import { CompactCard } from './shared/compact-card'

interface BillingSettingsProps {
  onUpdate: () => void
}

function PlanFeature({ children, included = true }: { children: string; included?: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Check className={`h-3 w-3 ${included ? 'text-green-600' : 'text-muted-foreground'}`} />
      <span className={included ? 'text-foreground' : 'text-muted-foreground'}>
        {children}
      </span>
      </div>
  )
}

function PlanCard({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  current = false,
  popular = false 
}: {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  current?: boolean
  popular?: boolean
}) {
  return (
    <CompactCard 
      padding="sm" 
      className={`relative ${popular ? 'border-primary' : ''}`}
    >
      {popular && (
        <div className="absolute -top-2 left-3">
          <Badge className="bg-primary text-primary-foreground text-xs">
            Most Popular
          </Badge>
        </div>
      )}
      
      <div className="space-y-3">
        {/* Header */}
          <div className="flex items-center justify-between">
            <div>
            <h4 className="font-medium text-foreground text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div className="text-right">
            <div className="font-semibold text-foreground">{price}</div>
            <div className="text-xs text-muted-foreground">/{period}</div>
              </div>
            </div>
            
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {features.map((feature, index) => (
            <PlanFeature key={index}>{feature}</PlanFeature>
          ))}
            </div>
            
        {/* Action */}
        <Button 
          size="sm" 
          variant={current ? "outline" : "default"}
          className="w-full h-8"
          disabled
        >
          {current ? 'Current Plan' : 'Coming Soon'}
            </Button>
          </div>
    </CompactCard>
  )
}

export function BillingSettings({ onUpdate }: BillingSettingsProps) {
  // Handle onUpdate to avoid unused warning
  void onUpdate

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <CompactCard padding="sm" className="border-l-4 border-l-green-500/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-green-500/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">Free Plan</h4>
              <p className="text-xs text-muted-foreground">
                All features free during beta • No billing required
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">Active</Badge>
        </div>
      </CompactCard>

      {/* Current Plan Details */}
      <SettingsSection
        title="Current Plan"
        description="Your active subscription details"
        compact
      >
              <div className="space-y-1">
          <SettingsRow
            label="Plan"
            value="Free (Beta)"
            badge={<Badge variant="secondary" className="text-xs">$0/month</Badge>}
            compact
          />
          <SettingsRow
            label="Prompts"
            value="100 limit"
            description="Unlimited during beta period"
            compact
          />
          <SettingsRow
            label="Team Members"
            value="5 limit"
            description="Unlimited during beta period"
            compact
          />
          <SettingsRow
            label="Storage"
            value="Unlimited"
            description="No restrictions during beta"
            compact
          />
              </div>
      </SettingsSection>

      {/* Upcoming Plans */}
      <SettingsSection
        title="Upgrade Options"
        description="Plans available when billing launches"
        compact
        action={
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Coming Soon</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <PlanCard
            name="Free"
            price="$0"
            period="month"
            description="Perfect for individuals"
            current={true}
            features={[
              "100 prompts",
              "5 team members",
              "Basic templates",
              "Community support"
            ]}
          />
          
          <PlanCard
            name="Pro"
            price="$19"
            period="month"
            description="For professionals"
            popular={true}
            features={[
              "Unlimited prompts",
              "25 team members",
              "Advanced AI models",
              "Priority support",
              "Version history",
              "API access"
            ]}
          />
        </div>
        
        <PlanCard
          name="Team"
          price="$49"
          period="month"
          description="For growing teams"
          features={[
            "Everything in Pro",
            "Unlimited members",
            "Team analytics",
            "Custom integrations",
            "Advanced permissions",
            "24/7 support"
          ]}
        />
      </SettingsSection>

      {/* Beta Notice */}
      <CompactCard padding="sm" className="bg-muted/50">
        <div className="flex items-start gap-2">
          <Star className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-foreground">Beta Access</h4>
            <p className="text-xs text-muted-foreground">
              You&apos;re using Promption during our free beta period. All Pro and Team features are available at no cost. 
              Billing will be introduced gradually with plenty of advance notice.
            </p>
          </div>
            </div>
      </CompactCard>

      {/* Future Billing */}
      <SettingsSection
        title="Billing Information"
        description="Payment methods and billing history"
        compact
      >
        <div className="space-y-1">
          <SettingsRow
            label="Payment Method"
            description="No payment method required during beta"
            badge={<Badge variant="outline" className="text-xs">Not Required</Badge>}
            compact
            disabled
          />
          <SettingsRow
            label="Billing History"
            description="No charges during beta period"
            badge={<Badge variant="outline" className="text-xs">Empty</Badge>}
            compact
            disabled
          />
          <SettingsRow
            label="Next Billing Date"
            description="TBD when billing launches"
            badge={<Badge variant="outline" className="text-xs">TBD</Badge>}
            compact
            disabled
          />
          </div>
      </SettingsSection>
    </div>
  )
}

BillingSettings.displayName = 'BillingSettings' 