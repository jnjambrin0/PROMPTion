import Link from 'next/link'
import { ArrowLeft, Clock, Brain, Layers, Zap, CheckCircle, Code, Users, ArrowRight, Target, Lightbulb, AlertTriangle, Star, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function AdvancedTechniquesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <div className="mb-8">
        <Link 
          href="/guides"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Badge 
            variant="outline" 
            className="text-xs font-medium"
            style={{ 
              backgroundColor: '#fef2f2', 
              borderColor: '#fecaca', 
              color: '#b91c1c' 
            }}
          >
            Advanced
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            18 min read
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Advanced Prompting Techniques
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Master sophisticated prompting strategies used by AI researchers and power users. 
          From chain-of-thought reasoning to meta-prompting, these techniques will unlock the full potential of AI systems.
        </p>

        {/* Prerequisites warning */}
        <div 
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: '#fefce8', borderColor: '#fef08a', borderWidth: '1px' }}
        >
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 mt-0.5" style={{ color: '#b45309' }} />
            <div>
              <h3 className="font-semibold mb-2" style={{ color: '#92400e' }}>Prerequisites</h3>
              <p className="text-sm mb-3" style={{ color: '#a16207' }}>
                This guide assumes solid understanding of basic prompting principles. 
                If you're new to prompt engineering, start with our 
                <Link href="/guides/prompt-engineering-101" className="underline font-medium hover:text-yellow-800">
                  foundational guide
                </Link> first.
              </p>
              <div className="text-sm" style={{ color: '#a16207' }}>
                <strong>You should be comfortable with:</strong> Basic prompt structure, context setting, output formatting, and common optimization techniques.
              </div>
            </div>
          </div>
        </div>

        {/* What you'll learn */}
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
        >
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 mt-0.5" style={{ color: '#1d4ed8' }} />
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#1e40af' }}>Advanced Skills You'll Master</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#1e3a8a' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Chain-of-thought and step-by-step reasoning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Few-shot and zero-shot learning strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Meta-prompting and self-reflection techniques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Prompt chaining and decomposition</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Advanced reasoning patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Debugging and optimization strategies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="space-y-16">
        {/* Section 1: Chain of Thought */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Chain-of-Thought Prompting</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Chain-of-thought (CoT) prompting dramatically improves AI reasoning by encouraging step-by-step thinking. 
              This technique has proven effective across mathematical reasoning, logical puzzles, and complex analysis tasks.
            </p>
          </div>

          {/* Why it works */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">The Science Behind Chain-of-Thought</h3>
            <p className="text-gray-700 leading-relaxed">
              Research shows that when AI models are prompted to show their reasoning process, they activate different neural pathways 
              that lead to more accurate and consistent outputs. The "thinking out loud" approach mirrors human problem-solving.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: '1px' }}
              >
                <h4 className="font-semibold mb-3" style={{ color: '#b91c1c' }}>❌ Without Chain-of-Thought</h4>
                <div 
                  className="p-4 rounded-lg font-mono text-sm mb-3"
                  style={{ backgroundColor: '#ffffff', color: '#374151' }}
                >
                  "What's 15% of 240 plus 30% of 180?"
                </div>
                <p className="text-sm" style={{ color: '#7f1d1d' }}>
                  Result: Often incorrect or inconsistent answers like "90" without explanation.
                </p>
              </div>
              
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#f0fdf4', borderColor: '#dcfce7', borderWidth: '1px' }}
              >
                <h4 className="font-semibold mb-3" style={{ color: '#166534' }}>✅ With Chain-of-Thought</h4>
                <div 
                  className="p-4 rounded-lg font-mono text-sm mb-3"
                  style={{ backgroundColor: '#ffffff', color: '#374151' }}
                >
                  "What's 15% of 240 plus 30% of 180? Let's work through this step by step."
                </div>
                <p className="text-sm" style={{ color: '#166534' }}>
                  Result: Accurate calculation with clear reasoning: "15% of 240 = 36, 30% of 180 = 54, so 36 + 54 = 90"
                </p>
              </div>
            </div>
          </div>

          {/* CoT Variations */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Chain-of-Thought Variations</h3>
            
            <div className="grid gap-6">
              {[
                {
                  title: "Basic CoT",
                  trigger: "Let's think step by step",
                  useCase: "Simple math, basic reasoning",
                  example: "Solve this math problem step by step: What's the area of a triangle with base 12 and height 8?"
                },
                {
                  title: "Zero-Shot CoT",
                  trigger: "Let's work through this systematically",
                  useCase: "Complex problems without examples",
                  example: "A company's revenue increased 20% in Q1, decreased 15% in Q2. What's the net change? Work systematically."
                },
                {
                  title: "Few-Shot CoT", 
                  trigger: "Here are examples, follow the pattern",
                  useCase: "When you have good examples",
                  example: "Example 1: Problem → Step 1 → Step 2 → Answer. Now solve this new problem following the same pattern."
                },
                {
                  title: "Self-Consistency CoT",
                  trigger: "Generate multiple reasoning paths",
                  useCase: "High-stakes decisions",
                  example: "Solve this three different ways, then compare your answers for consistency."
                }
              ].map((variation, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-6"
                  style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#1d4ed8' }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">{variation.title}</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Trigger:</span>
                          <div className="text-gray-600 mt-1">{variation.trigger}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Best for:</span>
                          <div className="text-gray-600 mt-1">{variation.useCase}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Example:</span>
                          <div className="text-gray-600 mt-1 font-mono text-xs">{variation.example}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Few-Shot Learning */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Few-Shot Learning Mastery</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Few-shot learning leverages the AI's pattern recognition abilities by providing examples of the desired input-output relationship. 
              When done correctly, this technique can achieve near-perfect task performance with just a few examples.
            </p>
          </div>

          {/* Example Quality */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">The Art of Example Selection</h3>
            <p className="text-gray-700 leading-relaxed">
              The quality of your examples matters more than quantity. Three perfect examples often outperform ten mediocre ones.
            </p>

            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <h4 className="font-semibold text-gray-900 mb-4">Example: Email Classification</h4>
              
              <div className="space-y-4">
                <div 
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', borderWidth: '1px' }}
                >
                  <div className="font-mono text-sm space-y-3">
                    <div>
                      <span style={{ color: '#166534' }}>Email:</span> "Hi Sarah, just wanted to follow up on our meeting yesterday. When can we schedule the next phase review?"<br/>
                      <span style={{ color: '#b91c1c' }}>Category:</span> Work - Follow-up<br/>
                      <span style={{ color: '#7e22ce' }}>Priority:</span> Medium
                    </div>
                    
                    <div>
                      <span style={{ color: '#166534' }}>Email:</span> "URGENT: Your account will be suspended in 24 hours unless you verify your payment information immediately!"<br/>
                      <span style={{ color: '#b91c1c' }}>Category:</span> Spam - Phishing<br/>
                      <span style={{ color: '#7e22ce' }}>Priority:</span> Delete
                    </div>
                    
                    <div>
                      <span style={{ color: '#166534' }}>Email:</span> "Thanks for the great dinner last night! Let's do it again soon. How about next weekend?"<br/>
                      <span style={{ color: '#b91c1c' }}>Category:</span> Personal - Social<br/>
                      <span style={{ color: '#7e22ce' }}>Priority:</span> Low
                    </div>
                    
                    <div style={{ color: '#b45309', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                      <span>Now classify this email:</span><br/>
                      "The project deadline has been moved up to Friday. Please confirm you can deliver the deliverables by then."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Few-Shot Patterns */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Advanced Few-Shot Patterns</h3>
            
            <div className="grid gap-6">
              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: '#fefce8', borderColor: '#fef9c3', borderWidth: '1px' }}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#b45309' }} />
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: '#92400e' }}>Progressive Complexity</h4>
                    <p className="text-sm mb-3" style={{ color: '#a16207' }}>
                      Start with simple examples and gradually increase complexity. This helps the AI understand the underlying pattern better.
                    </p>
                    <div 
                      className="p-3 rounded text-xs font-mono"
                      style={{ backgroundColor: '#ffffff', color: '#374151' }}
                    >
                      Example 1: Simple case → Solution<br/>
                      Example 2: Medium complexity → Solution<br/>
                      Example 3: Complex case → Solution<br/>
                      Now solve: [Your complex problem]
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: '#faf5ff', borderColor: '#f3e8ff', borderWidth: '1px' }}
              >
                <div className="flex items-start gap-3">
                  <Layers className="h-5 w-5 mt-0.5" style={{ color: '#7e22ce' }} />
                  <div>
                    <h4 className="font-semibold mb-3" style={{ color: '#6b21a8' }}>Diverse Edge Cases</h4>
                    <p className="text-sm mb-3" style={{ color: '#7c3aed' }}>
                      Include examples that cover edge cases and boundary conditions to make your prompts more robust.
                    </p>
                    <div 
                      className="p-3 rounded text-xs font-mono"
                      style={{ backgroundColor: '#ffffff', color: '#374151' }}
                    >
                      Normal case: Input → Standard output<br/>
                      Edge case 1: Empty input → Handle gracefully<br/>
                      Edge case 2: Invalid input → Error message<br/>
                      Edge case 3: Ambiguous input → Ask for clarification
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Meta-Prompting */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Meta-Prompting & Self-Reflection</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Meta-prompting involves prompts that help AI systems reason about their own thinking process. 
              This advanced technique can significantly improve output quality and reliability.
            </p>
          </div>

          {/* Self-Reflection Techniques */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Self-Reflection Techniques</h3>
            
            <div className="grid gap-6">
              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <h4 className="font-semibold text-gray-900 mb-4">The "Critique and Revise" Pattern</h4>
                <div className="space-y-4">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#f8fafc' }}
                  >
                    <div className="font-mono text-sm space-y-2">
                      <div><strong>Step 1:</strong> Generate initial response</div>
                      <div><strong>Step 2:</strong> "Now critique your response. What could be improved?"</div>
                      <div><strong>Step 3:</strong> "Based on your critique, provide a revised answer."</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    This pattern often produces significantly higher quality outputs by leveraging the AI's ability to self-evaluate.
                  </p>
                </div>
              </div>

              <div 
                className="rounded-xl p-6"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <h4 className="font-semibold text-gray-900 mb-4">Confidence Calibration</h4>
                <div 
                  className="p-4 rounded-lg font-mono text-sm"
                  style={{ backgroundColor: '#f8fafc' }}
                >
                  "On a scale of 1-10, how confident are you in this answer? If below 8, explain your uncertainty and provide alternative approaches."
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Helps identify when the AI is uncertain and encourages exploration of alternatives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Prompt Chaining */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Prompt Chaining & Decomposition</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Complex tasks often require breaking them into smaller, manageable pieces. Prompt chaining allows you to create 
              sophisticated workflows by connecting multiple prompts in sequence.
            </p>
          </div>

          {/* Chaining Examples */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Practical Chaining Workflows</h3>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f0f9ff', borderColor: '#dbeafe', borderWidth: '1px' }}
            >
              <h4 className="font-semibold mb-4" style={{ color: '#1e40af' }}>Example: Content Creation Pipeline</h4>
              
              <div className="space-y-4">
                {[
                  {
                    step: "Research",
                    prompt: "Research and summarize key trends in [topic] for the last 6 months",
                    output: "Research summary with key points and statistics"
                  },
                  {
                    step: "Outline",
                    prompt: "Based on this research: [insert research], create a detailed outline for a 2000-word article",
                    output: "Structured outline with main sections and key points"
                  },
                  {
                    step: "Draft",
                    prompt: "Using this outline: [insert outline], write the introduction and first section",
                    output: "Polished introduction and first section"
                  },
                  {
                    step: "Review",
                    prompt: "Review this content for accuracy, clarity, and engagement. Suggest specific improvements",
                    output: "Detailed feedback and revision suggestions"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#1d4ed8' }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.step}</h5>
                      <div 
                        className="text-xs p-2 rounded mt-2 mb-2 font-mono"
                        style={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderWidth: '1px' }}
                      >
                        {item.prompt}
                      </div>
                      <div className="text-xs text-gray-500">→ {item.output}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Advanced Reasoning */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Advanced Reasoning Patterns</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These sophisticated reasoning patterns help AI systems handle complex logical problems, 
              multi-step analysis, and nuanced decision-making.
            </p>
          </div>

          {/* Reasoning Patterns */}
          <div className="grid gap-6">
            {[
              {
                title: "Socratic Questioning",
                description: "Guide AI through discovery by asking probing questions",
                pattern: "Instead of giving answers, ask the AI to question its assumptions",
                example: "\"What assumptions are you making? What evidence supports this? What are alternative explanations?\""
              },
              {
                title: "Devil's Advocate",
                description: "Challenge the AI to argue against its initial position",
                pattern: "Force consideration of opposing viewpoints",
                example: "\"Now argue the opposite position. What are the strongest counterarguments?\""
              },
              {
                title: "Multi-Perspective Analysis",
                description: "Examine issues from multiple stakeholder viewpoints",
                pattern: "Explicitly role-play different perspectives",
                example: "\"Analyze this decision from the perspectives of: customers, employees, shareholders, and regulators\""
              },
              {
                title: "Scenario Planning",
                description: "Explore multiple possible futures or outcomes",
                pattern: "Consider best-case, worst-case, and most likely scenarios",
                example: "\"Create three scenarios: optimistic, pessimistic, and realistic. What are the implications of each?\""
              }
            ].map((pattern, index) => (
              <div 
                key={index}
                className="rounded-lg p-6"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: '#5b21b6' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{pattern.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{pattern.description}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">PATTERN:</span>
                        <div className="text-xs text-gray-600 mt-1">{pattern.pattern}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">EXAMPLE:</span>
                        <div 
                          className="text-xs mt-1 p-2 rounded font-mono"
                          style={{ backgroundColor: '#f8fafc', color: '#374151' }}
                        >
                          {pattern.example}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Debugging & Optimization */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Debugging & Optimization</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              When advanced prompts don't work as expected, systematic debugging and optimization techniques 
              can help identify and fix the issues.
            </p>
          </div>

          {/* Common Issues */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Common Advanced Prompting Issues</h3>
            
            <div className="space-y-4">
              {[
                {
                  issue: "Inconsistent Chain-of-Thought",
                  symptoms: "Sometimes shows reasoning, sometimes doesn't",
                  solution: "Use stronger trigger phrases and provide consistent examples",
                  fix: "Add 'Think step by step and show all your work' + example with visible reasoning"
                },
                {
                  issue: "Example Overfitting",
                  symptoms: "AI copies examples too literally",
                  solution: "Diversify examples and add explicit variation instructions",
                  fix: "Include note: 'These are examples of the pattern, not templates to copy exactly'"
                },
                {
                  issue: "Meta-Prompt Confusion",
                  symptoms: "AI gets lost in self-reflection loops",
                  solution: "Limit reflection depth and provide clear exit criteria",
                  fix: "Add: 'After one round of critique and revision, provide your final answer'"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="rounded-xl p-6"
                  style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: '1px' }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: '#b91c1c' }} />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2" style={{ color: '#991b1b' }}>
                        {item.issue}
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: '#7f1d1d' }}>Symptoms:</span>
                          <div className="text-red-700 mt-1">{item.symptoms}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#7f1d1d' }}>Solution:</span>
                          <div className="text-red-700 mt-1">{item.solution}</div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: '#7f1d1d' }}>Quick Fix:</span>
                          <div 
                            className="text-xs mt-1 p-2 rounded font-mono"
                            style={{ backgroundColor: '#ffffff', color: '#374151' }}
                          >
                            {item.fix}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Practice Section */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Master-Level Challenges</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Test your advanced prompting skills with these real-world scenarios that require sophisticated techniques.
            </p>
          </div>

          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#fefce8', borderColor: '#fef9c3', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Play className="h-5 w-5 mt-0.5" style={{ color: '#b45309' }} />
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#92400e' }}>Challenge: Strategic Business Analysis</h3>
                <div className="space-y-4">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">Scenario</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      A mid-size SaaS company is considering entering the AI market. They need a comprehensive analysis 
                      that considers market timing, competitive landscape, resource requirements, and risk assessment.
                    </p>
                    <div className="text-sm text-gray-700">
                      <strong>Your task:</strong> Design a prompt chain that uses multiple advanced techniques to provide a thorough strategic analysis.
                    </div>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use chain-of-thought for complex reasoning</li>
                      <li>• Apply multi-perspective analysis</li>
                      <li>• Include self-reflection and critique</li>
                      <li>• Consider multiple scenarios</li>
                      <li>• Provide actionable recommendations</li>
                    </ul>
                  </div>
                  
                  <div 
                    className="p-3 rounded text-sm"
                    style={{ backgroundColor: '#fffbeb', color: '#a16207' }}
                  >
                    💡 <strong>Hint:</strong> Start with stakeholder identification, then use prompt chaining to build complexity gradually.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Continue Mastering</h2>
          
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 mt-0.5 text-yellow-500" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Advanced Journey Continues</h4>
                <p className="text-gray-600 mb-6">
                  You've mastered sophisticated prompting techniques! Now apply these skills to organizational and collaborative contexts.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link 
                    href="/guides/organization-strategies"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Organization Strategies</div>
                      <div className="text-sm text-gray-500">Scale your prompting with systematic organization</div>
                    </div>
                  </Link>
                  <Link 
                    href="/guides/team-collaboration"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Team Collaboration</div>
                      <div className="text-sm text-gray-500">Share and scale advanced techniques with teams</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  )
} 