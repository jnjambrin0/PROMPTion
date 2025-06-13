import Link from 'next/link'
import { ArrowLeft, Clock, Target, CheckCircle, Lightbulb, AlertCircle, Star, Book, Zap, ArrowRight, Copy, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PromptEngineering101Page() {
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
              backgroundColor: '#f0fdf4', 
              borderColor: '#86efac', 
              color: '#16a34a' 
            }}
          >
            Beginner
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            12 min read
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          The Complete Guide to Prompt Engineering
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          Master the art and science of communicating with AI systems. From basic principles to advanced techniques, 
          this comprehensive guide will transform how you work with AI.
        </p>

        {/* Learning objectives */}
        <div 
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderWidth: '1px' }}
        >
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#0c4a6e' }}>What you'll master</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: '#0369a1' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>The psychology behind effective prompts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Advanced prompting frameworks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Common pitfalls and how to avoid them</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Real-world prompt templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Testing and optimization strategies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Industry-specific best practices</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="mb-12">
        <div 
          className="rounded-xl p-6"
          style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Table of Contents</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <a href="#fundamentals" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              1. The Fundamentals
            </a>
            <a href="#anatomy" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              2. Anatomy of Great Prompts
            </a>
            <a href="#frameworks" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              3. Proven Frameworks
            </a>
            <a href="#optimization" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              4. Optimization Techniques
            </a>
            <a href="#common-mistakes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              5. Common Mistakes
            </a>
            <a href="#practice" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              6. Practice Exercises
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <article className="space-y-16">
        {/* Section 1: Fundamentals */}
        <section id="fundamentals" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">The Fundamentals</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Prompt engineering is both an art and a science. At its core, it's about understanding how AI models process language 
              and crafting instructions that leverage this understanding to achieve specific outcomes.
            </p>
          </div>

          {/* History & Context */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Why Prompts Matter</h3>
            <p className="text-gray-700 leading-relaxed">
              Modern AI models like GPT-4, Claude, and others are trained on vast amounts of text data. They don't "understand" 
              in the human sense, but they've learned incredibly sophisticated patterns about how language works. The prompt 
              is your interface to this vast knowledge.
            </p>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d', borderWidth: '1px' }}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 mt-0.5" style={{ color: '#d97706' }} />
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: '#92400e' }}>The 80/20 Rule of Prompting</h4>
                  <p className="text-sm" style={{ color: '#a16207' }}>
                    80% of your prompt's effectiveness comes from 20% of your effort: being specific about what you want, 
                    providing relevant context, and clearly defining the output format. Master these basics before moving to advanced techniques.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mental Models */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Mental Models for AI Communication</h3>
            <div className="grid gap-6">
              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <h4 className="font-medium text-gray-900 mb-3">Think of AI as a Highly Capable Intern</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Brilliant and knowledgeable, but needs clear direction and context. You wouldn't tell an intern 
                  "do marketing stuff" — you'd give specific tasks, deadlines, and examples.
                </p>
                <div 
                  className="p-3 rounded font-mono text-sm"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  ❌ "Write content for our website"<br/>
                  ✅ "Write a 150-word 'About Us' section for a B2B SaaS company that helps restaurants manage inventory. Tone: professional but approachable. Include our 5-year track record."
                </div>
              </div>

              <div 
                className="rounded-lg p-6"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <h4 className="font-medium text-gray-900 mb-3">AI as a Pattern-Matching Engine</h4>
                <p className="text-sm text-gray-600 mb-3">
                  AI excels at recognizing and replicating patterns. The more specific your pattern examples, 
                  the better the AI can match your desired output style.
                </p>
                <div 
                  className="p-3 rounded font-mono text-sm"
                  style={{ backgroundColor: '#f3f4f6' }}
                >
                  ✅ "Format like this example: [Problem] → [Solution] → [Benefit]"
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Anatomy */}
        <section id="anatomy" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Anatomy of Great Prompts</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every effective prompt has five core components. Master these building blocks, and you'll be able to construct 
              prompts for any situation.
            </p>
          </div>

          {/* The 5 Components */}
          <div className="space-y-6">
            {[
              {
                title: "1. Context (WHO & WHERE)",
                description: "Set the stage with relevant background information",
                color: "#f0f9ff",
                borderColor: "#dbeafe",
                textColor: "#1e40af",
                example: `You are a senior UX designer at a fintech startup. The company has 50,000 users and focuses on helping freelancers manage their finances.`
              },
              {
                title: "2. Role (WHO YOU ARE)", 
                description: "Define the perspective and expertise level",
                color: "#f0fdf4",
                borderColor: "#bbf7d0",
                textColor: "#15803d",
                example: `Act as an expert email marketer with 10 years of experience in B2B SaaS marketing.`
              },
              {
                title: "3. Task (WHAT TO DO)",
                description: "Clearly state the specific action you want",
                color: "#fefce8",
                borderColor: "#fef08a", 
                textColor: "#b45309",
                example: `Create a welcome email sequence for new users who just signed up for our project management tool.`
              },
              {
                title: "4. Format (HOW TO STRUCTURE)",
                description: "Specify the desired output format and structure",
                color: "#faf5ff",
                borderColor: "#e9d5ff",
                textColor: "#7e22ce",
                example: `Format as: Subject line, 3 short paragraphs, clear CTA button text. Keep each email under 150 words.`
              },
              {
                title: "5. Constraints (BOUNDARIES)",
                description: "Set limitations and requirements",
                color: "#fef2f2",
                borderColor: "#fecaca",
                textColor: "#b91c1c",
                example: `Requirements: Mobile-friendly, avoid jargon, include one personalization element, comply with GDPR.`
              }
            ].map((component, index) => (
              <div 
                key={index}
                className="rounded-xl p-6"
                style={{ backgroundColor: component.color, borderColor: component.borderColor, borderWidth: '1px' }}
              >
                <h4 className="font-semibold mb-3" style={{ color: component.textColor }}>
                  {component.title}
                </h4>
                <p className="text-sm mb-4" style={{ color: component.textColor }}>
                  {component.description}
                </p>
                <div 
                  className="p-3 rounded font-mono text-sm"
                  style={{ backgroundColor: '#ffffff', color: '#374151' }}
                >
                  {component.example}
                </div>
              </div>
            ))}
          </div>

          {/* Complete Example */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Complete Example: Putting It All Together</h3>
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-900">Master Template</span>
              </div>
              <div 
                className="p-4 rounded-lg font-mono text-sm leading-relaxed"
                style={{ backgroundColor: '#ffffff', color: '#374151' }}
              >
                <span style={{ color: '#3b82f6' }}>[CONTEXT]</span> You are a senior content strategist at a B2B SaaS company that helps small businesses automate their accounting. Our main competitors are QuickBooks and FreshBooks.<br/><br/>
                
                <span style={{ color: '#16a34a' }}>[ROLE]</span> Act as an expert blog writer who specializes in educational content for small business owners.<br/><br/>
                
                <span style={{ color: '#f59e0b' }}>[TASK]</span> Write a blog post that explains the benefits of automated bookkeeping for small businesses.<br/><br/>
                
                <span style={{ color: '#9333ea' }}>[FORMAT]</span> Structure: Compelling headline, brief intro, 3 main sections with subheadings, conclusion with CTA. Length: 800-1000 words. Include 2-3 relevant statistics.<br/><br/>
                
                <span style={{ color: '#dc2626' }}>[CONSTRAINTS]</span> Tone: Helpful and authoritative, not salesy. Avoid technical jargon. Include actionable advice. Target audience: business owners with 1-50 employees who currently do manual bookkeeping.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Frameworks */}
        <section id="frameworks" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Proven Frameworks</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              These battle-tested frameworks will solve 90% of your prompting challenges. Each has specific use cases 
              where it excels.
            </p>
          </div>

          <div className="grid gap-8">
            {/* CLEAR Framework */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">The CLEAR Framework</h3>
                <p className="text-gray-600">For analytical and research tasks</p>
              </div>
              <div className="grid md:grid-cols-5 gap-4 mb-4">
                {[
                  { letter: "C", word: "Context", desc: "Background info" },
                  { letter: "L", word: "Length", desc: "Output size" },
                  { letter: "E", word: "Examples", desc: "Show patterns" },
                  { letter: "A", word: "Audience", desc: "Who it's for" },
                  { letter: "R", word: "Role", desc: "Your expertise" }
                ].map((item) => (
                  <div key={item.letter} className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white"
                      style={{ backgroundColor: '#3b82f6' }}
                    >
                      {item.letter}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.word}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div 
                className="p-4 rounded-lg text-sm"
                style={{ backgroundColor: '#f8fafc' }}
              >
                <strong>Use case:</strong> Market research, competitive analysis, data interpretation, academic writing
              </div>
            </div>

            {/* CREATE Framework */}
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">The CREATE Framework</h3>
                <p className="text-gray-600">For content creation and creative tasks</p>
              </div>
              <div className="grid md:grid-cols-6 gap-4 mb-4">
                {[
                  { letter: "C", word: "Character", desc: "Who's writing" },
                  { letter: "R", word: "Request", desc: "What you want" },
                  { letter: "E", word: "Examples", desc: "Show style" },
                  { letter: "A", word: "Adjustments", desc: "Specific tweaks" },
                  { letter: "T", word: "Type", desc: "Content format" },
                  { letter: "E", word: "Extras", desc: "Special requests" }
                ].map((item) => (
                  <div key={item.word} className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white"
                      style={{ backgroundColor: '#16a34a' }}
                    >
                      {item.letter}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.word}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
              <div 
                className="p-4 rounded-lg text-sm"
                style={{ backgroundColor: '#f0fdf4' }}
              >
                <strong>Use case:</strong> Blog posts, marketing copy, creative writing, social media content
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Exercise */}
        <section className="space-y-6">
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Play className="h-5 w-5 mt-0.5" style={{ color: '#d97706' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: '#92400e' }}>Interactive Exercise</h3>
                <p className="text-sm mb-4" style={{ color: '#a16207' }}>
                  Practice with this real scenario: You need to write product descriptions for an e-commerce store selling eco-friendly home products.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">❌ Poor Prompt</h4>
                    <div className="text-sm text-gray-600 font-mono">
                      "Write product descriptions for eco-friendly products"
                    </div>
                  </div>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <h4 className="font-medium text-gray-900 mb-2">✅ Better Prompt</h4>
                    <div className="text-sm text-gray-600 font-mono">
                      Context: E-commerce store, eco-conscious millennials<br/>
                      Role: Expert copywriter<br/>
                      Task: Product descriptions<br/>
                      Format: 2-3 sentences, bullet points<br/>
                      Constraints: Highlight sustainability, under 100 words
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Optimization */}
        <section id="optimization" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Optimization Techniques</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Take your prompts from good to exceptional with these advanced optimization strategies.
            </p>
          </div>

          <div className="grid gap-6">
            {[
              {
                title: "Temperature Control",
                description: "Adjust creativity vs consistency",
                tip: "Use lower temperature (0.1-0.3) for factual content, higher (0.7-0.9) for creative tasks"
              },
              {
                title: "Iterative Refinement", 
                description: "Build prompts through multiple iterations",
                tip: "Start simple, test output, add constraints based on what's missing or wrong"
              },
              {
                title: "Context Window Management",
                description: "Optimize for token limits",
                tip: "Front-load the most important information, use bullet points for lists"
              },
              {
                title: "Output Priming",
                description: "Start the AI's response",
                tip: "End your prompt with 'Here's a detailed analysis:' to set the tone"
              }
            ].map((technique, index) => (
              <div 
                key={index}
                className="rounded-lg p-6 flex items-start gap-4"
                style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: '1px' }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: '#6366f1' }}
                >
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{technique.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{technique.description}</p>
                  <div 
                    className="text-xs p-2 rounded"
                    style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
                  >
                    💡 <strong>Pro tip:</strong> {technique.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Common Mistakes */}
        <section id="common-mistakes" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Common Mistakes (And How to Fix Them)</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Learn from these frequent pitfalls that even experienced prompt engineers encounter.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                mistake: "Being Too Vague",
                problem: "\"Write me something good about productivity\"",
                solution: "\"Write a 500-word blog post for busy entrepreneurs about 3 specific productivity techniques that save at least 2 hours per day\"",
                lesson: "Specificity trumps brevity every time"
              },
              {
                mistake: "Assuming Context",
                problem: "\"Improve this email\" (without showing the email)",
                solution: "\"Here's the current email: [paste email]. Improve it by making the subject line more compelling and the CTA clearer\"",
                lesson: "Always provide complete context"
              },
              {
                mistake: "Ignoring Output Format",
                problem: "\"Analyze our competition\"",
                solution: "\"Create a competitive analysis table with columns: Company, Strengths, Weaknesses, Market Share, Pricing\"",
                lesson: "Define exactly how you want the output structured"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="rounded-xl p-6"
                style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5', borderWidth: '1px' }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" style={{ color: '#dc2626' }} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-3" style={{ color: '#991b1b' }}>
                      Mistake #{index + 1}: {item.mistake}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">PROBLEM</span>
                        <div 
                          className="mt-2 p-3 rounded font-mono text-sm"
                          style={{ backgroundColor: '#ffffff', color: '#374151' }}
                        >
                          {item.problem}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">SOLUTION</span>
                        <div 
                          className="mt-2 p-3 rounded font-mono text-sm"
                          style={{ backgroundColor: '#ffffff', color: '#374151' }}
                        >
                          {item.solution}
                        </div>
                      </div>
                      <div 
                        className="text-sm font-medium"
                        style={{ color: '#7f1d1d' }}
                      >
                        💡 Key lesson: {item.lesson}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Practice */}
        <section id="practice" className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Practice Exercises</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Apply what you've learned with these real-world scenarios. Try crafting prompts before looking at the solutions.
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                scenario: "Social Media Marketing",
                challenge: "Create Instagram captions for a sustainable fashion brand launching a new collection",
                requirements: ["Target: millennials and Gen Z", "Tone: authentic, not preachy", "Include hashtags", "Encourage engagement"],
                hint: "Think about the CLEAR framework and consider what makes social media content shareable"
              },
              {
                scenario: "Technical Documentation", 
                challenge: "Write API documentation for a new webhook feature",
                requirements: ["Audience: developers integrating our API", "Include code examples", "Cover error handling", "Step-by-step setup"],
                hint: "Developers need precision and practical examples. What would you want to see in documentation?"
              },
              {
                scenario: "Customer Support",
                challenge: "Create email templates for handling refund requests",
                requirements: ["Maintain brand voice", "Address common objections", "Provide clear next steps", "Multiple scenarios"],
                hint: "Think about the customer's emotional state and what information they need most"
              }
            ].map((exercise, index) => (
              <div 
                key={index}
                className="rounded-xl p-6"
                style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd', borderWidth: '1px' }}
              >
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 mt-0.5" style={{ color: '#0284c7' }} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-3" style={{ color: '#0c4a6e' }}>
                      Exercise #{index + 1}: {exercise.scenario}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Challenge</h5>
                        <p className="text-sm text-gray-600">{exercise.challenge}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Requirements</h5>
                        <ul className="space-y-1">
                          {exercise.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div 
                        className="p-3 rounded text-sm"
                        style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
                      >
                        💡 <strong>Hint:</strong> {exercise.hint}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">What's Next?</h2>
          
          <div 
            className="rounded-xl p-6"
            style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: '1px' }}
          >
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 mt-0.5 text-yellow-500" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Continue Your Journey</h4>
                <p className="text-gray-600 mb-6">
                  You've mastered the fundamentals! Now you're ready to explore more advanced techniques and specialized applications.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link 
                    href="/guides/advanced-techniques"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Advanced Techniques</div>
                      <div className="text-sm text-gray-500">Chain-of-thought, meta-prompting, and more</div>
                    </div>
                  </Link>
                  <Link 
                    href="/guides/organization-strategies"
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Organization Strategies</div>
                      <div className="text-sm text-gray-500">Build and maintain your prompt library</div>
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