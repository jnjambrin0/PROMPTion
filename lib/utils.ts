import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  let result = ""

  if (diffInYears > 0) {
    result = diffInYears === 1 ? "1 year" : `${diffInYears} years`
  } else if (diffInMonths > 0) {
    result = diffInMonths === 1 ? "1 month" : `${diffInMonths} months`
  } else if (diffInWeeks > 0) {
    result = diffInWeeks === 1 ? "1 week" : `${diffInWeeks} weeks`
  } else if (diffInDays > 0) {
    result = diffInDays === 1 ? "1 day" : `${diffInDays} days`
  } else if (diffInHours > 0) {
    result = diffInHours === 1 ? "1 hour" : `${diffInHours} hours`
  } else if (diffInMinutes > 0) {
    result = diffInMinutes === 1 ? "1 minute" : `${diffInMinutes} minutes`
  } else {
    result = "less than a minute"
  }

  return options?.addSuffix ? `${result} ago` : result
}

export function formatDate(date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string {
  const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
    short: { 
      month: 'short' as const, 
      day: 'numeric' as const
    },
    medium: { 
      month: 'short' as const, 
      day: 'numeric' as const, 
      year: 'numeric' as const
    },
    long: { 
      weekday: 'long' as const,
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const
    }
  }

  return date.toLocaleDateString('en-US', formatOptions[format])
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date, 'medium')} at ${formatTime(date)}`
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return date.toDateString() === yesterday.toDateString()
}

export function getRelativeDate(date: Date): string {
  if (isToday(date)) {
    return `Today at ${formatTime(date)}`
  }
  if (isYesterday(date)) {
    return `Yesterday at ${formatTime(date)}`
  }
  
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 7) {
    return `${diffInDays} days ago`
  }
  
  return formatDate(date, 'medium')
}
