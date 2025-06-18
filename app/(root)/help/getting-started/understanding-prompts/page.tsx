import Link from 'next/link'
import { Calendar, ArrowRight, Settings, Lightbulb, Target, Blocks, Variable, Bot, Users, History, Share, Code, Type, Hash, Quote, List, Wand2, Eye, Play, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { HelpBreadcrumbs } from '@/components/help'

export default function UnderstandingPromptsPage() {
  const breadcrumbItems = [
    { label: 'Help', href: '/help' },
    { label: 'Getting Started', href: '/help/getting-started' },
    { label: 'Understanding Prompts' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <HelpBreadcrumbs 
          items={breadcrumbItems}
          showBackButton={true}
          backHref="/help/getting-started"
        />

        {/* Article Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Understanding Prompts
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Prompts are the building blocks of your AI workflows. They&apos;re structured templates that combine instructions, variables, and AI configurations to create consistent, reusable interactions with AI models. This comprehensive guide will help you master prompt creation and management.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Last updated: January 2025
          </div>
        </div>

        {/* What is a Prompt */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What is a Prompt?</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            A prompt is a structured template that combines instructions, content, and variables to create consistent interactions with AI models. Unlike simple text instructions, Promption prompts are sophisticated tools that can include multiple content blocks, dynamic variables, specific AI configurations, and collaborative features.
          </p>

          <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 mt-0.5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Think of Prompts as Smart Recipes</h4>
                <p className="text-sm text-blue-800">
                  Just like a recipe transforms ingredients into a dish, a prompt transforms your inputs and instructions into consistent, high-quality AI outputs. The difference is that prompts can adapt to different situations using variables and configurations.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Components</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Blocks className="h-4 w-4 text-blue-500" />
                  Structured content blocks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Variable className="h-4 w-4 text-green-500" />
                  Dynamic variables and placeholders
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Bot className="h-4 w-4 text-purple-500" />
                  AI model configurations
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Users className="h-4 w-4 text-orange-500" />
                  Collaboration and sharing features
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Consistency:</strong> Same quality output every time</p>
                <p><strong>Reusability:</strong> One prompt, multiple use cases</p>
                <p><strong>Collaboration:</strong> Share expertise across teams</p>
                <p><strong>Scalability:</strong> Automate repetitive AI tasks</p>
                <p><strong>Version Control:</strong> Track changes and improvements</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Content Block System */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Block-Based Content System</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Promption uses a Notion-style block system that allows you to create rich, structured content. Each block serves a specific purpose and can be combined to create sophisticated prompts.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Type className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Text Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Basic text content with rich formatting support. Perfect for instructions, explanations, and general content.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> Instructions, context, explanations
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4 text-orange-600" />
                <h4 className="font-medium text-gray-900">Heading Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Structure your content with hierarchical headings (H1-H6). Essential for organizing complex prompts.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> Sections, organization, structure
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Code className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-gray-900">Code Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Syntax-highlighted code with language support. Perfect for programming prompts and technical examples.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> Code examples, syntax references, technical content
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Variable className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-gray-900">Variable Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Define dynamic placeholders that can be filled in when using the prompt. Makes prompts flexible and reusable.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> User inputs, dynamic content, customization
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Quote className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Quote Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Highlight important information or examples. Great for showcasing expected outputs or key points.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> Examples, important notes, citations
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <List className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-gray-900">List Blocks</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Organize information with bullet points or numbered lists. Essential for step-by-step instructions.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Use for:</strong> Steps, options, checklists, requirements
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 mt-0.5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Pro Tip: Start Simple, Build Complex</h4>
                <p className="text-sm text-green-800">
                  Begin with basic text blocks to outline your prompt structure. Once you have the core logic working, add advanced blocks like variables and code examples to enhance functionality and reusability.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Variables System */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dynamic Variables System</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Variables are what make prompts truly powerful. They allow you to create flexible templates that can be customized for different use cases while maintaining consistent structure and quality.
          </p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variable Types</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">String Variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Free-form text input. Most common type for names, descriptions, and open-ended content.
                </p>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {`{{company_name}}`}
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Number Variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Numeric input with validation. Perfect for quantities, scores, and calculations.
                </p>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {`{{budget_amount}}`}
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Boolean Variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  True/false switches. Great for enabling optional features or different modes.
                </p>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {`{{include_examples}}`}
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Select Variables</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Dropdown with predefined options. Ensures consistent choices and reduces errors.
                </p>
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {`{{tone_of_voice}}`}
                </div>
              </Card>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Variable Best Practices</h3>
            <div className="space-y-4">
              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">1. Use Descriptive Names</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-red-600 font-medium mb-1">❌ Avoid:</p>
                    <div className="bg-red-50 p-2 rounded font-mono">
                      {`{{input1}}, {{text}}, {{data}}`}
                    </div>
                  </div>
                  <div>
                    <p className="text-green-600 font-medium mb-1">✅ Better:</p>
                    <div className="bg-green-50 p-2 rounded font-mono">
                      {`{{target_audience}}, {{brand_tone}}, {{key_features}}`}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">2. Provide Clear Descriptions</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Every variable should have a description explaining what it&apos;s for and how to use it.
                </p>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <strong>Variable:</strong> target_audience<br/>
                  <strong>Description:</strong> &quot;The primary demographic for this content (e.g., &apos;young professionals&apos;, &apos;enterprise decision makers&apos;)&quot;
                </div>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">3. Set Sensible Defaults</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Provide default values to make prompts easier to use and demonstrate expected input format.
                </p>
                <div className="bg-gray-50 p-2 rounded text-sm">
                  <strong>Variable:</strong> writing_style<br/>
                  <strong>Default:</strong> &quot;Professional but approachable&quot;<br/>
                  <strong>Type:</strong> Select (Professional, Casual, Technical, Creative)
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Model Configuration</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Fine-tune how AI models respond to your prompts by adjusting parameters like temperature, token limits, and sampling methods. These settings can dramatically affect output quality and consistency.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Model Selection</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-900">GPT-4:</strong>
                  <p className="text-gray-600">Best for complex reasoning, analysis, and creative tasks</p>
                </div>
                <div>
                  <strong className="text-gray-900">GPT-4 Mini:</strong>
                  <p className="text-gray-600">Faster and cost-effective for simpler tasks</p>
                </div>
                <div>
                  <strong className="text-gray-900">Claude:</strong>
                  <p className="text-gray-600">Excellent for long-form content and detailed analysis</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Key Parameters</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-gray-900">Temperature (0-2):</strong>
                  <p className="text-gray-600">Controls creativity vs consistency. Lower = more predictable</p>
                </div>
                <div>
                  <strong className="text-gray-900">Max Tokens:</strong>
                  <p className="text-gray-600">Maximum response length. Set based on expected output size</p>
                </div>
                <div>
                  <strong className="text-gray-900">Top P (0-1):</strong>
                  <p className="text-gray-600">Alternative to temperature. Controls response diversity</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 mt-0.5 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Configuration Guidelines</h4>
                <div className="space-y-2 text-sm text-yellow-800">
                  <p><strong>Creative Tasks:</strong> Higher temperature (0.7-1.0) for variety and creativity</p>
                  <p><strong>Analytical Tasks:</strong> Lower temperature (0.1-0.3) for consistency and accuracy</p>
                  <p><strong>General Purpose:</strong> Medium temperature (0.5-0.7) for balanced responses</p>
                  <p><strong>Code Generation:</strong> Low temperature (0.0-0.2) for reliable, functional code</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Collaboration Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Collaboration and Sharing</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Prompts become more powerful when shared across teams. Promption&apos;s collaboration features enable real-time teamwork, knowledge sharing, and collective improvement of your AI workflows.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Viewer Access</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Can view and use the prompt but cannot make changes. Perfect for sharing proven templates.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Best for:</strong> Template distribution, reference materials
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-gray-900">Comment Access</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Can view, use, and add comments for feedback and suggestions. Great for review processes.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Best for:</strong> Feedback collection, review workflows
              </div>
            </Card>

            <Card className="p-4 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-gray-900">Editor Access</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Full editing permissions including content changes and configuration updates. For trusted collaborators.
              </p>
              <div className="text-xs text-gray-500">
                <strong>Best for:</strong> Core team members, co-creators
              </div>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaboration Best Practices</h3>
            <div className="space-y-4">
              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Clear Ownership Structure</h4>
                <p className="text-sm text-gray-600">
                  Designate prompt owners responsible for maintenance and quality. Limit editor access to 2-3 people to avoid conflicts while ensuring continuity.
                </p>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Version Communication</h4>
                <p className="text-sm text-gray-600">
                  Use descriptive change logs when updating prompts. Notify team members of significant changes that might affect their workflows.
                </p>
              </Card>

              <Card className="p-4 border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Template Strategy</h4>
                <p className="text-sm text-gray-600">
                  Create stable templates for common use cases. Keep experimental prompts separate from production-ready ones.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Version Control */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Version Control and History</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Every change to your prompts is automatically tracked. This powerful versioning system allows you to experiment confidently, compare different approaches, and revert to previous versions when needed.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Automatic Versioning</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Every save creates a new version</li>
                <li>• Complete snapshot of content and settings</li>
                <li>• Timestamp and author tracking</li>
                <li>• Optional change log messages</li>
              </ul>
            </Card>

            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Share className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Version Benefits</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Experiment without fear</li>
                <li>• Compare performance across versions</li>
                <li>• Revert to working configurations</li>
                <li>• Track team improvements over time</li>
              </ul>
            </Card>
          </div>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">When to Create New Versions</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <strong className="block mb-2">Major Changes:</strong>
                <ul className="space-y-1">
                  <li>• Restructuring content blocks</li>
                  <li>• Adding/removing variables</li>
                  <li>• Changing AI model or parameters</li>
                  <li>• Updating core instructions</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-2">Minor Updates:</strong>
                <ul className="space-y-1">
                  <li>• Fixing typos or grammar</li>
                  <li>• Adjusting descriptions</li>
                  <li>• Fine-tuning parameters</li>
                  <li>• Adding examples</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Common Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Use Cases and Examples</h2>
          
          <div className="space-y-6">
            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Creation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Generate blog posts, social media content, and marketing copy with consistent brand voice and style.
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500 mb-2">Example Variables:</div>
                <div className="text-sm font-mono space-y-1">
                  <div>{`{{topic}} - Content subject`}</div>
                  <div>{`{{target_audience}} - Reader demographic`}</div>
                  <div>{`{{brand_tone}} - Voice and style`}</div>
                  <div>{`{{content_length}} - Word count goal`}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Generation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create functions, review code, generate tests, and write documentation with specific requirements and constraints.
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500 mb-2">Example Variables:</div>
                <div className="text-sm font-mono space-y-1">
                  <div>{`{{programming_language}} - Code language`}</div>
                  <div>{`{{function_purpose}} - What it should do`}</div>
                  <div>{`{{input_parameters}} - Function inputs`}</div>
                  <div>{`{{coding_style}} - Style guidelines`}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create consistent, helpful responses to common customer inquiries while maintaining brand voice and accuracy.
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500 mb-2">Example Variables:</div>
                <div className="text-sm font-mono space-y-1">
                  <div>{`{{customer_issue}} - Problem description`}</div>
                  <div>{`{{severity_level}} - Urgency level`}</div>
                  <div>{`{{customer_tier}} - Service level`}</div>
                  <div>{`{{resolution_steps}} - Troubleshooting actions`}</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analysis</h3>
              <p className="text-gray-600 text-sm mb-4">
                Analyze datasets, generate insights, create reports, and summarize findings with structured approaches.
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-xs text-gray-500 mb-2">Example Variables:</div>
                <div className="text-sm font-mono space-y-1">
                  <div>{`{{dataset_description}} - Data source`}</div>
                  <div>{`{{analysis_goal}} - What to find`}</div>
                  <div>{`{{key_metrics}} - Important measures`}</div>
                  <div>{`{{report_format}} - Output structure`}</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Best Practices Summary</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Do&apos;s ✅</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Start with clear objectives and success criteria</li>
                <li>• Use descriptive names for prompts and variables</li>
                <li>• Test thoroughly with real data before sharing</li>
                <li>• Document your approach and reasoning</li>
                <li>• Iterate based on team feedback and results</li>
                <li>• Organize prompts with meaningful categories</li>
                <li>• Set appropriate AI model parameters</li>
                <li>• Create reusable templates for common patterns</li>
              </ul>
            </Card>

            <Card className="p-6 bg-red-50 border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Don&apos;ts ❌</h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Create overly complex prompts for simple tasks</li>
                <li>• Use generic or unclear variable names</li>
                <li>• Skip testing with edge cases and variations</li>
                <li>• Ignore version control and change tracking</li>
                <li>• Share untested prompts with your team</li>
                <li>• Overcomplicate with unnecessary variables</li>
                <li>• Use inappropriate AI model settings</li>
                <li>• Forget to update documentation when changing prompts</li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <Card className="p-8 bg-gray-50 border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🚀 Ready to Create Your First Prompt?
          </h3>
          <p className="text-gray-600 mb-6">
            Now that you understand how prompts work, it&apos;s time to put this knowledge into practice. Start with a simple use case and gradually build complexity as you become more comfortable.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Plan Your Prompt</h4>
              <p className="text-sm text-gray-600">Define your goal, identify needed variables, and sketch the content structure</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Create and Test</h4>
              <p className="text-sm text-gray-600">Build your prompt using the block editor and test with real examples</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Configure AI Settings</h4>
              <p className="text-sm text-gray-600">Fine-tune model parameters for optimal results</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">4. Share and Iterate</h4>
              <p className="text-sm text-gray-600">Get team feedback and improve based on real usage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/prompts/new">
                <Play className="h-4 w-4 mr-2" />
                Create Your First Prompt
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/help/prompt-engineering">
                Advanced Techniques
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}