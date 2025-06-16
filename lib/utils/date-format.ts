import { formatDistanceToNow, format, isValid, parseISO } from 'date-fns'

// ============================================================================
// DATE FORMATTING UTILITIES
// ============================================================================

/**
 * Safely formats last active date with proper error handling
 */
export function formatLastActive(lastActiveAt: Date | string | null | undefined): string {
  if (!lastActiveAt) {
    return 'Never'
  }

  try {
    let date: Date

    // Handle string dates (ISO format from database)
    if (typeof lastActiveAt === 'string') {
      date = parseISO(lastActiveAt)
    } else {
      date = lastActiveAt
    }

    // Validate the date
    if (!isValid(date)) {
      return 'Never'
    }

    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    // Handle very recent activity
    if (diffInMinutes < 1) {
      return 'Just now'
    }

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    }

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    }

    if (diffInDays === 1) {
      return 'Yesterday'
    }

    if (diffInDays < 7) {
      return `${diffInDays}d ago`
    }

    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7)
      return `${weeks}w ago`
    }

    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30)
      return `${months}mo ago`
    }

    // For very old dates, show the actual date
    return format(date, 'MMM d, yyyy')
  } catch (error) {
    console.warn('Error formatting last active date:', error)
    return 'Never'
  }
}

/**
 * Formats join date consistently
 */
export function formatJoinDate(joinedAt: Date | string | null | undefined): string {
  if (!joinedAt) {
    return 'Owner' // For workspace owners who don't have a join date
  }

  try {
    let date: Date

    if (typeof joinedAt === 'string') {
      date = parseISO(joinedAt)
    } else {
      date = joinedAt
    }

    if (!isValid(date)) {
      return 'Unknown'
    }

    return format(date, 'MMM d, yyyy')
  } catch (error) {
    console.warn('Error formatting join date:', error)
    return 'Unknown'
  }
}

/**
 * Formats relative time for general use
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) {
    return 'Never'
  }

  try {
    let parsedDate: Date

    if (typeof date === 'string') {
      parsedDate = parseISO(date)
    } else {
      parsedDate = date
    }

    if (!isValid(parsedDate)) {
      return 'Invalid date'
    }

    return formatDistanceToNow(parsedDate, { addSuffix: true })
  } catch (error) {
    console.warn('Error formatting relative time:', error)
    return 'Unknown'
  }
}

/**
 * Formats absolute date for display
 */
export function formatAbsoluteDate(date: Date | string | null | undefined): string {
  if (!date) {
    return 'No date'
  }

  try {
    let parsedDate: Date

    if (typeof date === 'string') {
      parsedDate = parseISO(date)
    } else {
      parsedDate = date
    }

    if (!isValid(parsedDate)) {
      return 'Invalid date'
    }

    return format(parsedDate, 'MMMM d, yyyy \'at\' h:mm a')
  } catch (error) {
    console.warn('Error formatting absolute date:', error)
    return 'Invalid date'
  }
} 