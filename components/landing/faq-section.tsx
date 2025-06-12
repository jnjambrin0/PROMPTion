'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FAQSection() {
  const faqs = [
    {
      question: "What makes Promption different from other note-taking apps?",
      answer: "Promption is specifically designed for AI prompts and prompt engineering. Unlike general note-taking apps, we provide specialized features like prompt templates, version history, performance analytics, and AI-specific organization tools that understand the unique needs of prompt engineers."
    },
    {
      question: "Can I import my existing prompts from other tools?",
      answer: "Yes! We support importing from popular tools like Notion, Obsidian, plain text files, and CSV formats. Our import wizard makes it easy to migrate your existing prompt library while preserving your organization structure."
    },
    {
      question: "Is there a free plan available?",
      answer: "Absolutely! Our free plan includes up to 50 prompts, basic organization features, and mobile access. It's perfect for getting started and seeing if Promption fits your workflow. You can upgrade anytime as your needs grow."
    },
    {
      question: "How does the team collaboration work?",
      answer: "Team plans include shared workspaces where team members can collaborate on prompt collections, share templates, and manage permissions. You can control who can view, edit, or manage different prompt collections, making it perfect for prompt engineering teams."
    },
    {
      question: "Can I use Promption offline?",
      answer: "Yes! Our mobile and desktop apps work offline, syncing your changes when you're back online. You can access, edit, and create prompts even without an internet connection."
    },
    {
      question: "What kind of analytics does Promption provide?",
      answer: "Pro and Team plans include analytics on prompt usage, performance metrics, version comparisons, and usage patterns. This helps you understand which prompts work best and optimize your prompt engineering workflow based on data."
    },
    {
      question: "Is my data secure and private?",
      answer: "Security is our top priority. We use enterprise-grade encryption, SOC 2 compliance, and never train AI models on your data. Your prompts remain completely private and are only accessible by you and your team members."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. If you cancel, you'll retain access to your paid features until the end of your billing period."
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-25">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="mx-auto max-w-[600px] text-lg text-gray-600">
            Everything you need to know about Promption. Can't find what you're looking for? 
            <a href="/contact" className="text-gray-900 hover:underline ml-1">Contact our support team</a>.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg px-6 data-[state=open]:shadow-card-hover transition-all duration-200"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 [&[data-state=open]>svg]:rotate-180">
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
} 