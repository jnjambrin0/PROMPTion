import SearchClient from './search-client';
import { Suspense } from 'react';
import SearchLoading from './loading';

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Search
        </h1>
        <p className="text-muted-foreground mt-1">
          Find anything across your workspaces, prompts, and templates.
        </p>
      </header>
      <Suspense fallback={<SearchLoading />}>
        <SearchClient />
      </Suspense>
    </div>
  );
}
