'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ProductDemo() {
  const demoTabs = [
    {
      id: "workspace",
      label: "Workspace",
      title: "Your organized command center",
      description: "See all your prompts, collections, and recent activity in one beautiful interface. Everything organized exactly how you want it.",
      image: "/hero-workspace.svg"
    },
    {
      id: "editor",
      label: "Editor",
      title: "Powerful prompt editing",
      description: "Create and edit prompts with syntax highlighting, variables, and real-time preview. Perfect for complex prompt engineering.",
      image: "/demo-editor.svg"
    },
    {
      id: "search",
      label: "Search",
      title: "Find anything instantly",
      description: "Lightning-fast search across all your prompts. Filter by tags, content, date, or any criteria that matters to your workflow.",
      image: "/demo-search.svg"
    }
  ]

  return (
    <section id="demo" className="w-full py-16 md:py-24 lg:py-32 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            See Promption in action
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Explore the features that make Promption the perfect home for your AI prompts.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="workspace" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              {demoTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="text-sm font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {demoTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="space-y-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {tab.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {tab.description}
                  </p>
                </div>
                
                <div className="relative mx-auto max-w-5xl">
                  <div className="relative rounded-xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
                    <img
                      src={tab.image}
                      alt={`${tab.title} - Promption feature demonstration`}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
} 