import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

/*
 * =================================================================================================
 * Layout Components
 * =================================================================================================
 */

/**
 * The main layout for legal pages, featuring a sticky navigation sidebar and main content area.
 * @param nav - The navigation component, typically <LegalContentNavigator />.
 * @param children - The main content of the page.
 */
export function LegalPageLayout({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="hidden lg:col-span-3 lg:block">{nav}</div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}

/**
 * A sticky navigation component for legal pages.
 * @param sections - An array of sections with title and id to generate nav links.
 * @param title - The title to display above the navigation links.
 */
export function LegalContentNavigator({
  sections,
  title,
}: {
  sections: Array<{ title: string; id: string }>;
  title: string;
}) {
  return (
    <nav className="sticky top-24 self-start">
      <h3 className="mb-4 font-semibold text-lg">{title}</h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/*
 * =================================================================================================
 * Content Components
 * =================================================================================================
 */

/**
 * The header component for legal pages, displaying title and last updated date.
 * @param title - The main title of the page.
 * @param lastUpdated - The date the document was last updated.
 */
export function LegalPageHeader({
  title,
  lastUpdated,
}: {
  title: string;
  lastUpdated: string;
}) {
  return (
    <header className="mb-12 border-b pb-8">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Última actualización: {lastUpdated}
      </p>
    </header>
  );
}

/**
 * A wrapper for content sections, providing a title and an id for anchor linking.
 * @param id - The unique identifier for the section, used for anchor links.
 * @param title - The title of the section.
 * @param children - The content of the section.
 */
export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
}

/**
 * A styled box for highlighting important information, with variants for different contexts.
 * @param variant - 'default' for general info, 'destructive' for warnings.
 * @param children - The content of the info box.
 */
export function InfoBox({
  variant = 'default',
  children,
}: {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'my-6 rounded-lg border p-4',
        variant === 'destructive'
          ? 'border-destructive/20 bg-destructive/10 text-destructive'
          : 'border-border bg-muted/50'
      )}
    >
      {children}
    </div>
  );
}

/**
 * A card component for displaying structured items like user rights or pricing plans.
 * @param title - The title of the card.
 * @param description - The main description or price.
 * @param Icon - An optional icon component from lucide-react.
 * @param features - An optional list of features or bullet points.
 */
export function LegalCard({
  title,
  description,
  Icon,
  features,
}: {
  title: string;
  description: string;
  Icon?: LucideIcon;
  features?: string[];
}) {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-card p-6">
      {Icon && (
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="font-semibold text-lg">{title}</h3>
      <p
        className={cn(
          'mt-1',
          !features && 'text-muted-foreground',
          features && 'text-2xl font-bold'
        )}
      >
        {description}
      </p>
      {features && (
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 