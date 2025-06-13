import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface CompactCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function CompactCard({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}: CompactCardProps) {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <Card className={`${hover ? 'hover:shadow-sm transition-shadow' : ''} ${className}`}>
      <CardContent className={paddingClasses[padding]}>
        {children}
      </CardContent>
    </Card>
  )
} 