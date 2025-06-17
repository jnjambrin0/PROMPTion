'use client'

import React from 'react'
import { Zap, Code } from 'lucide-react'

export function IntegrationsSettings() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-muted/50 rounded-lg border-2 border-dashed border-border">
      <div className="p-3 bg-primary/10 rounded-full mb-4">
        <Zap className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        Integrations Coming Soon
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        We are working hard to bring you powerful integrations with your favorite tools. Connect Promption to Slack, GitHub, and more.
      </p>
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Code className="h-3 w-3" />
        <span>API access will also be available.</span>
      </div>
    </div>
  )
} 