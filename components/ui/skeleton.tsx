import { cn } from "@/lib/utils"

function Skeleton({ 
  className, 
  variant = "default",
  ...props 
}: React.ComponentProps<"div"> & {
  variant?: "default" | "circle" | "text" | "button" | "card"
}) {
  const variants = {
    default: "bg-neutral-200 animate-pulse rounded-md",
    circle: "bg-neutral-200 animate-pulse rounded-full",
    text: "bg-neutral-200 animate-pulse rounded-sm",
    button: "bg-neutral-200 animate-pulse rounded-lg",
    card: "bg-neutral-200 animate-pulse rounded-xl"
  }

  return (
    <div
      data-slot="skeleton"
      className={cn(variants[variant], className)}
      {...props}
    />
  )
}

// Skeleton text patterns for consistent spacing
function SkeletonText({ 
  lines = 1, 
  className = "",
  lastLineWidth = "75%"
}: {
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            "h-4",
            i === lines - 1 && lines > 1 ? `w-[${lastLineWidth}]` : "w-full"
          )}
        />
      ))}
    </div>
  )
}

// Skeleton for user avatars
function SkeletonAvatar({ 
  size = "md",
  className = ""
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  return (
    <Skeleton
      variant="circle"
      className={cn(sizes[size], className)}
    />
  )
}

// Skeleton for buttons
function SkeletonButton({ 
  size = "md",
  className = ""
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizes = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32"
  }

  return (
    <Skeleton
      variant="button"
      className={cn(sizes[size], className)}
    />
  )
}

export { 
  Skeleton, 
  SkeletonText, 
  SkeletonAvatar, 
  SkeletonButton 
}
