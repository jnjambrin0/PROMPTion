import { createClient } from '@/utils/supabase/server'
import { getUserByAuthId, getUserWorkspaces } from '@/lib/db'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

interface WorkspaceSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export async function WorkspaceSelector({ 
  value, 
  placeholder = "Select workspace...",
  className
}: Omit<WorkspaceSelectorProps, 'onValueChange'>) {
  // Get current user's workspaces
  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return null
  }

  const user = await getUserByAuthId(authUser.id)
  if (!user) {
    return null
  }

  const workspaces = await getUserWorkspaces(user.id)

  return (
    <div className="space-y-2">
      <Label htmlFor="workspace">
        Workspace <span className="text-red-500">*</span>
      </Label>
      
      <Select value={value} name="workspaceId" required>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{workspace.name}</span>
                <span className="text-sm text-gray-500">
                  ({workspace._count?.prompts || 0} prompts)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 