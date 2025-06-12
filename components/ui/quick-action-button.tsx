import Link from 'next/link'
import { QuickAction } from '@/lib/types/navigation'

interface QuickActionButtonProps {
  action: QuickAction
  variant?: 'default' | 'dashed'
  className?: string
}

export function QuickActionButton({ 
  action, 
  variant = 'default',
  className = '' 
}: QuickActionButtonProps) {
  const baseClass = `
    flex flex-col items-center justify-center p-3 md:p-4 rounded-md transition-all
    notion-hover border text-center min-h-[70px] md:min-h-[80px] group
  `
  
  const variantClass = variant === 'dashed'
    ? 'border-dashed border-neutral-300 bg-neutral-50/50 hover:bg-neutral-100/50'
    : 'border-neutral-200 bg-white hover:bg-neutral-50'

  const content = (
    <>
      <action.icon className="h-4 w-4 md:h-5 md:w-5 text-neutral-600 mb-1.5 md:mb-2 group-hover:text-neutral-700 transition-colors" />
      <span className="text-xs md:text-sm font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">
        {action.label}
      </span>
    </>
  )

  if (action.href) {
    return (
      <Link 
        href={action.href}
        className={`${baseClass} ${variantClass} ${className}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button 
      onClick={action.action}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {content}
    </button>
  )
} 