// Re-export all prompt-related actions
export * from './crud'
export * from './favorites'

// Keep main exports for backward compatibility during transition
export { createPromptAction, updatePromptAction } from './crud'
export { toggleFavoritePromptAction, checkPromptFavoriteAction } from './favorites' 