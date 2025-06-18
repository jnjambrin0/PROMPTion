import Link from 'next/link';
import { Landmark, FileText, Cookie, Shield } from 'lucide-react';

import { SettingsSection } from './shared/settings-section';

const legalLinks = [
  {
    href: '/terms',
    label: 'Términos de Uso',
    description: 'Las reglas que rigen el uso de Promption.',
    Icon: FileText,
  },
  {
    href: '/privacy',
    label: 'Política de Privacidad',
    description: 'Cómo gestionamos y protegemos tus datos.',
    Icon: Shield,
  },
  {
    href: '/cookies',
    label: 'Política de Cookies',
    description: 'Información sobre las cookies que utilizamos.',
    Icon: Cookie,
  },
  {
    href: '/legal',
    label: 'Aviso Legal',
    description: 'Información legal y de la empresa.',
    Icon: Landmark,
  },
];

export function LegalSettings() {
  return (
    <SettingsSection
      title="Legal y Cumplimiento"
      description="Consulta nuestros documentos legales para entender tus derechos y responsabilidades."
    >
      <div className="mt-6 space-y-4">
        {legalLinks.map(({ href, label, description, Icon }) => (
          <Link
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-semibold">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </SettingsSection>
  );
} 