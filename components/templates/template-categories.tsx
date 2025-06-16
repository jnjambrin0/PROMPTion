'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  count: number
  icon: string | null
}

interface TemplateCategoriesProps {
  categories: Category[]
  selectedCategory?: string
}

export function TemplateCategories({ categories, selectedCategory }: TemplateCategoriesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    
    // Reset to first page when changing category
    params.delete('page')
    
    router.push(`/templates?${params.toString()}`)
  }

  const isSelected = (categoryId: string) => {
    if (categoryId === 'all') {
      return !selectedCategory || selectedCategory === 'all'
    }
    return selectedCategory === categoryId
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Browse by Category</h2>
        <p className="text-neutral-600">Find templates tailored to your specific needs</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => updateCategory('all')}
          className={`h-auto p-3 flex flex-col items-center gap-2 min-w-[120px] ${
            isSelected('all') 
              ? 'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900' 
              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-900'
          }`}
        >
          <span className="text-lg">🌟</span>
          <div className="text-center">
            <div className="font-medium text-sm">All Templates</div>
            <div className="text-xs opacity-70">
              {categories.reduce((sum, cat) => sum + cat.count, 0)}
            </div>
          </div>
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            onClick={() => updateCategory(category.id)}
            className={`h-auto p-3 flex flex-col items-center gap-2 min-w-[120px] ${
              isSelected(category.id) 
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900' 
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-900'
            }`}
          >
            <span className="text-lg">{category.icon || '📁'}</span>
            <div className="text-center">
              <div className="font-medium text-sm">{category.name}</div>
              <div className="text-xs opacity-70">{category.count}</div>
            </div>
          </Button>
        ))}
      </div>
    </section>
  )
} 