interface TemplatesStatsProps {
  totalTemplates: number
  totalAuthors: number
  totalUsage: number
  featuredCount: number
}

export function TemplatesStats({ totalTemplates, totalAuthors, totalUsage, featuredCount }: TemplatesStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div className="text-2xl md:text-3xl font-bold text-neutral-900">
          {totalTemplates}
        </div>
        <div className="text-sm text-neutral-600">
          Total Templates
        </div>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div className="text-2xl md:text-3xl font-bold text-neutral-900">
          {formatNumber(totalUsage)}
        </div>
        <div className="text-sm text-neutral-600">
          Times Used
        </div>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div className="text-2xl md:text-3xl font-bold text-neutral-900">
          {totalAuthors}
        </div>
        <div className="text-sm text-neutral-600">
          Contributors
        </div>
      </div>
      
      <div className="text-center p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <div className="text-2xl md:text-3xl font-bold text-neutral-900">
          {featuredCount}
        </div>
        <div className="text-sm text-neutral-600">
          Featured
        </div>
      </div>
    </div>
  )
} 