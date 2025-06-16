import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const categoryButtonVariants = cva(
  "inline-flex h-auto p-3 flex-col items-center gap-2 min-w-[120px] whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50",
        active:
          "border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-neutral-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface CategoryButtonProps {
  icon?: string
  name: string
  count?: number
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function CategoryButton({
  icon,
  name,
  count,
  isSelected = false,
  onClick,
  className
}: CategoryButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-left p-2 h-auto justify-start",
        isSelected ? "bg-accent" : "hover:bg-accent/50",
        className
      )}
    >
      <span className="text-lg">{icon}</span>
      <div className="text-center">
        <div className="font-medium text-sm">{name}</div>
        {count !== undefined && (
          <div className="text-xs opacity-70">{count}</div>
        )}
      </div>
    </Button>
  )
}

export { categoryButtonVariants } 