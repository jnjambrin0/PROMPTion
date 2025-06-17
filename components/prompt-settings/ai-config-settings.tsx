'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Bot, Sliders, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import type { PromptSettingsData } from '@/lib/actions/prompt-settings'

interface AIConfigSettingsProps {
  settings: PromptSettingsData
  canEdit: boolean
  onUpdate: (updates: Partial<PromptSettingsData>) => void
}

const AI_MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast and efficient' },
  { value: 'gpt-4o', label: 'GPT-4o', description: 'Most capable' },
  { value: 'gpt-o3-mini', label: 'GPT-o3 Mini', description: 'Latest reasoning model (mini)' },
  { value: 'gpt-o3', label: 'GPT-o3', description: 'Latest reasoning model' }
] as const

// ✅ Componente optimizado para parámetros individuales
const ParameterControl = React.memo(({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  description, 
  canEdit, 
  onChange 
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  description: string
  canEdit: boolean
  onChange: (value: number) => void
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleNumberClick = useCallback(() => {
    if (canEdit) {
      setIsEditing(true)
      setInputValue(value.toString())
    }
  }, [canEdit, value])

  const handleInputSubmit = useCallback(() => {
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue)
    } else {
      setInputValue(value.toString()) // Reset to previous value if invalid
    }
    setIsEditing(false)
  }, [inputValue, min, max, onChange, value])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputSubmit()
    } else if (e.key === 'Escape') {
      setInputValue(value.toString())
      setIsEditing(false)
    }
  }, [handleInputSubmit, value])

  const handleSliderChange = useCallback((newValue: number[]) => {
    onChange(newValue[0])
  }, [onChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
                    <Label htmlFor={label.toLowerCase()} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        {isEditing ? (
          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={handleInputKeyDown}
            min={min}
            max={max}
            step={step}
            className="w-20 h-6 text-xs px-2"
            autoFocus
          />
        ) : (
          <span 
            className={`text-sm font-mono text-foreground ${canEdit ? 'cursor-pointer hover:bg-muted px-2 py-1 rounded' : ''}`}
            onClick={handleNumberClick}
            title={canEdit ? 'Click to edit value' : ''}
          >
            {value}
          </span>
        )}
      </div>
      <Slider
        id={label.toLowerCase()}
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        disabled={!canEdit}
        className="w-full"
      />
              <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
})

ParameterControl.displayName = 'ParameterControl'

export const AIConfigSettings = React.memo(({ settings, canEdit, onUpdate }: AIConfigSettingsProps) => {
  // ✅ Get current model config with defaults
  const modelConfig = useMemo(() => settings.modelConfig || {}, [settings.modelConfig])
  
  // ✅ Callbacks memoizados específicos
  const handleModelChange = useCallback((value: string) => {
    onUpdate({ aiModel: value })
  }, [onUpdate])

  const handleMaxTokensChange = useCallback((value: string) => {
    const numValue = parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      onUpdate({ 
        modelConfig: {
          ...modelConfig,
          maxTokens: numValue
        }
      })
    }
  }, [onUpdate, modelConfig])

  const handleTemperatureChange = useCallback((value: number) => {
    onUpdate({ 
      modelConfig: {
        ...modelConfig,
        temperature: value
      }
    })
  }, [onUpdate, modelConfig])

  const handleTopPChange = useCallback((value: number) => {
    onUpdate({ 
      modelConfig: {
        ...modelConfig,
        topP: value
      }
    })
  }, [onUpdate, modelConfig])

  const handleFrequencyPenaltyChange = useCallback((value: number) => {
    onUpdate({ 
      modelConfig: {
        ...modelConfig,
        frequencyPenalty: value
      }
    })
  }, [onUpdate, modelConfig])

  const handlePresencePenaltyChange = useCallback((value: number) => {
    onUpdate({ 
      modelConfig: {
        ...modelConfig,
        presencePenalty: value
      }
    })
  }, [onUpdate, modelConfig])

  // ✅ Valor computado memoizado
  const selectedModel = useMemo(
    () => AI_MODELS.find(model => model.value === settings.aiModel),
    [settings.aiModel]
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            <CardTitle>AI Model Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure the AI model and parameters for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-3">
            <Label htmlFor="ai-model" className="text-sm font-medium text-foreground">
              AI Model
            </Label>
            <Select value={settings.aiModel || ''} onValueChange={handleModelChange} disabled={!canEdit}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{model.label}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedModel && (
              <p className="text-xs text-muted-foreground">
                {selectedModel.description}
              </p>
            )}
          </div>

          {/* Max Tokens */}
          <div className="space-y-3">
            <Label htmlFor="max-tokens" className="text-sm font-medium text-foreground">
              Max Tokens
            </Label>
            <Input
              id="max-tokens"
              type="number"
              value={modelConfig.maxTokens || 4096}
              onChange={(e) => handleMaxTokensChange(e.target.value)}
              min={1}
              max={8192}
              disabled={!canEdit}
              className="w-full"
            />
            <p className="text-xs text-#6b7280">
              Maximum number of tokens in the response (1-8192)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Model Parameters</CardTitle>
          </div>
          <CardDescription>
            Fine-tune the model&apos;s behavior for more precise control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ParameterControl
            label="Temperature"
            value={modelConfig.temperature ?? 0.7}
            min={0}
            max={2}
            step={0.1}
            description="Controls randomness. Lower values are more deterministic."
            canEdit={canEdit}
            onChange={handleTemperatureChange}
          />
          <ParameterControl
            label="Top P"
            value={modelConfig.topP ?? 1}
            min={0}
            max={1}
            step={0.1}
            description="Controls nucleus sampling. 1.0 considers all tokens."
            canEdit={canEdit}
            onChange={handleTopPChange}
          />
          <ParameterControl
            label="Frequency Penalty"
            value={modelConfig.frequencyPenalty ?? 0}
            min={-2}
            max={2}
            step={0.1}
            description="Penalizes new tokens based on their frequency."
            canEdit={canEdit}
            onChange={handleFrequencyPenaltyChange}
          />
          <ParameterControl
            label="Presence Penalty"
            value={modelConfig.presencePenalty ?? 0}
            min={-2}
            max={2}
            step={0.1}
            description="Penalizes new tokens if they appear in the text so far."
            canEdit={canEdit}
            onChange={handlePresencePenaltyChange}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Prompt Variables</CardTitle>
          </div>
          <CardDescription>
            Define dynamic variables to insert into your prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div 
            className="p-4 rounded-lg border border-border bg-muted"
          >
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Coming Soon</p>
                <p className="text-muted-foreground">
                  A new interface to manage prompt variables will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

AIConfigSettings.displayName = 'AIConfigSettings' 