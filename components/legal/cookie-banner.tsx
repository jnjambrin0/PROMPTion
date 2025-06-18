'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Definiendo el tipo para la función gtag para mayor seguridad de tipos
declare global {
  interface Window {
    gtag?: (
      command: 'consent',
      action: 'update',
      params: { analytics_storage: 'granted' | 'denied' }
    ) => void;
  }
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Retrasar ligeramente la aparición para no ser tan abrupto
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (consentType: 'all' | 'essential') => {
    localStorage.setItem('cookie-consent', consentType);
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);

    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: consentType === 'all' ? 'granted' : 'denied',
      });
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[100] animate-in slide-in-from-bottom-5 fade-in-25">
      <div className="flex items-center gap-4 rounded-lg border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Cookie className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Usamos cookies.{' '}
            <Link href="/cookies" className="underline hover:text-primary">
              Saber más
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleConsent('essential')}
            variant="ghost"
            size="sm"
          >
            Rechazar
          </Button>
          <Button onClick={() => handleConsent('all')} size="sm">
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
} 