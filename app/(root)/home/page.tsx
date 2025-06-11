import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Clock, 
  FileText, 
  Folder, 
  TrendingUp,
  Calendar,
  Settings,
  Bell
} from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex h-12 items-center justify-between px-6">
          {/* Left side - Search */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search prompts..."
                className="pl-10 h-8 border-transparent bg-gray-50 focus:bg-white focus:border-gray-200 transition-all duration-150 text-sm"
              />
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              <Settings className="h-4 w-4" />
            </Button>
            <form action={handleSignOut}>
              <Button variant="ghost" size="sm" type="submit" className="h-8 px-3 text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50 min-h-screen">
          <div className="p-4">
            {/* Brand */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-6 w-6 flex items-center justify-center rounded bg-gray-900 text-white text-xs font-semibold">
                P
              </div>
              <span className="font-semibold text-gray-900">Promption</span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-1 mb-6">
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-gray-700 hover:bg-gray-100 font-normal">
                <Plus className="mr-3 h-4 w-4" />
                New prompt
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-gray-700 hover:bg-gray-100 font-normal">
                <Search className="mr-3 h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Navigation */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workspace
              </div>
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-gray-700 hover:bg-gray-100 font-normal">
                <FileText className="mr-3 h-4 w-4" />
                All prompts
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-gray-700 hover:bg-gray-100 font-normal">
                <Folder className="mr-3 h-4 w-4" />
                Collections
              </Button>
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-gray-700 hover:bg-gray-100 font-normal">
                <Clock className="mr-3 h-4 w-4" />
                Recent
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Center - Recent Activity */}
          <main className="flex-1 max-w-4xl mx-auto p-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Good morning, {user.email?.split('@')[0]}
              </h1>
              <p className="text-gray-600 text-sm">
                Here's what's been happening with your prompts.
              </p>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              {/* Quick Actions Grid */}
              <div className="grid grid-cols-4 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                  <Plus className="h-5 w-5 text-gray-500" />
                  <span className="text-xs text-gray-600">New prompt</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                  <Folder className="h-5 w-5 text-gray-500" />
                  <span className="text-xs text-gray-600">Collection</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-xs text-gray-600">Template</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                  <span className="text-xs text-gray-600">Import</span>
                </Button>
              </div>

              {/* Recent Activity List */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Recent activity</h2>
                <div className="space-y-2">
                  {/* Empty state */}
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No activity yet</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Start by creating your first prompt or collection.
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white h-8 px-4 text-sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Create prompt
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-72 border-l border-gray-200 bg-gray-50 p-6 space-y-6">
            {/* Coming Up */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Coming up</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      Weekly prompt review
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Tomorrow at 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Popular topics</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-white rounded-md border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Content writing</span>
                  <span className="text-xs text-gray-500">24 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Code generation</span>
                  <span className="text-xs text-gray-500">18 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Data analysis</span>
                  <span className="text-xs text-gray-500">12 prompts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Creative writing</span>
                  <span className="text-xs text-gray-500">9 prompts</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick stats</h3>
              <div className="bg-white rounded-md border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total prompts</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Collections</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">This week</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tips</h3>
              <div className="bg-white rounded-md border border-gray-200 p-4">
                <p className="text-sm text-gray-700 mb-2">
                  💡 <strong>Pro tip:</strong> Use tags to organize your prompts by category or project.
                </p>
                <p className="text-xs text-gray-500">
                  Tags make it easy to find exactly what you're looking for later.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
} 