import { Metadata } from 'next';
import { Cookie, Settings } from 'lucide-react';

import {
  LegalContentNavigator,
  LegalPageHeader,
  LegalPageLayout,
  LegalSection,
  InfoBox,
} from '@/components/legal/legal-components';

export const metadata: Metadata = {
  title: 'Política de Cookies | Promption',
  description:
    'Entiende qué cookies utilizamos en Promption y cómo puedes gestionarlas para proteger tu privacidad.',
};

const sections = [
  { id: 'que-son-cookies', title: '1. ¿Qué son las Cookies?' },
  { id: 'como-usamos-cookies', title: '2. ¿Cómo utilizamos las Cookies?' },
  { id: 'tipos-de-cookies', title: '3. Tipos de Cookies que utilizamos' },
  { id: 'cookies-terceros', title: '4. Cookies de Terceros' },
  { id: 'gestion-cookies', title: '5. Gestión de Cookies' },
  { id: 'actualizaciones', title: '6. Actualizaciones de esta Política' },
  { id: 'contacto', title: '7. Contacto' },
];

function CookieTable({
  cookies,
}: {
  cookies: Array<{
    name: string;
    provider: string;
    purpose: string;
    duration: string;
  }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr>
            <th className="p-2 font-semibold">Cookie</th>
            <th className="p-2 font-semibold">Proveedor</th>
            <th className="p-2 font-semibold">Propósito</th>
            <th className="p-2 font-semibold">Duración</th>
          </tr>
        </thead>
        <tbody>
          {cookies.map((cookie) => (
            <tr key={cookie.name} className="border-t">
              <td className="p-2 font-mono text-xs">{cookie.name}</td>
              <td className="p-2">{cookie.provider}</td>
              <td className="p-2">{cookie.purpose}</td>
              <td className="p-2">{cookie.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <div className="bg-background">
      <LegalPageLayout
        nav={<LegalContentNavigator sections={sections} title="Navegación" />}
      >
        <div className="mt-8">

        <LegalPageHeader
          title="Política de Cookies"
          lastUpdated="16 de junio, 2025"
        />
        </div>

        <main>
          <LegalSection id="que-son-cookies" title="1. ¿Qué son las Cookies?">
            <div className="flex items-start">
              <Cookie className="mr-4 h-8 w-8 flex-shrink-0 text-primary" />
              <p>
                Las cookies son pequeños archivos de texto que los sitios web
                almacenan en su dispositivo (ordenador, tablet, smartphone)
                cuando los visita. Se utilizan ampliamente para hacer que los
                sitios web funcionen, o funcionen de manera más eficiente, así
                como para proporcionar información a los propietarios del
                sitio.
              </p>
            </div>
          </LegalSection>

          <LegalSection
            id="como-usamos-cookies"
            title="2. ¿Cómo utilizamos las Cookies?"
          >
            <p>
              En Promption, utilizamos cookies para finalidades clave que nos
              permiten ofrecer un servicio seguro y funcional:
            </p>
            <ul>
              <li>
                <strong>Mantener su sesión iniciada</strong> de forma segura.
              </li>
              <li>
                <strong>Recordar sus preferencias,</strong> como el tema visual
                (claro/oscuro).
              </li>
              <li>
                <strong>Analizar cómo se utiliza nuestro servicio</strong> de
                forma agregada y anónima para identificar áreas de mejora.
              </li>
              <li>
                <strong>Mejorar el rendimiento general</strong> y la
                experiencia de usuario en la plataforma.
              </li>
            </ul>
          </LegalSection>

          <LegalSection
            id="tipos-de-cookies"
            title="3. Tipos de Cookies que utilizamos"
          >
            <h3 className="mt-4 text-xl font-semibold">
              3.1 Cookies Esenciales (Obligatorias)
            </h3>
            <p>
              Son estrictamente necesarias para el funcionamiento básico de
              Promption. Sin ellas, el sitio no puede funcionar correctamente.
              Incluyen cookies de autenticación y seguridad.
            </p>
            <div className="my-4 rounded-lg border bg-muted/50 p-4">
              <CookieTable
                cookies={[
                  {
                    name: 'auth-token',
                    provider: 'Supabase',
                    purpose: 'Mantener sesión iniciada',
                    duration: 'Sesión',
                  },
                  {
                    name: 'sb-access-token',
                    provider: 'Supabase',
                    purpose: 'Autenticación segura',
                    duration: '1 hora',
                  },
                  {
                    name: 'sb-refresh-token',
                    provider: 'Supabase',
                    purpose: 'Renovar autenticación',
                    duration: '30 días',
                  },
                ]}
              />
            </div>

            <h3 className="mt-8 text-xl font-semibold">
              3.2 Cookies de Rendimiento y Análisis
            </h3>
            <p>
              Nos ayudan a entender cómo los visitantes interactúan con nuestro
              sitio web, permitiéndonos mejorar el servicio. Estos datos son
              agregados y anónimos.
            </p>
            <div className="my-4 rounded-lg border bg-muted/50 p-4">
              <CookieTable
                cookies={[
                  {
                    name: '_vercel_analytics',
                    provider: 'Vercel',
                    purpose: 'Análisis de uso agregado',
                    duration: '1 año',
                  },
                  {
                    name: 'va_uid',
                    provider: 'Vercel',
                    purpose: 'ID único de visitante anónimo',
                    duration: '1 año',
                  },
                ]}
              />
            </div>
            <h3 className="mt-8 text-xl font-semibold">
              3.3 Cookies de Funcionalidad
            </h3>
            <p>
              Permiten al sitio web recordar las elecciones que hace (como su
              nombre de usuario, idioma o la región en la que se encuentra) y
              proporcionar características mejoradas y más personales.
            </p>
            <div className="my-4 rounded-lg border bg-muted/50 p-4">
              <CookieTable
                cookies={[
                  {
                    name: 'theme',
                    provider: 'Promption',
                    purpose: 'Preferencia de tema (claro/oscuro)',
                    duration: '1 año',
                  },
                  {
                    name: 'locale',
                    provider: 'Promption',
                    purpose: 'Idioma preferido',
                    duration: '1 año',
                  },
                ]}
              />
            </div>
          </LegalSection>
          
          <LegalSection
            id="cookies-terceros"
            title="4. Cookies de Terceros"
          >
            <p>
              Algunas funcionalidades de nuestro sitio utilizan proveedores de
              servicios externos, los cuales pueden instalar sus propias
              cookies.{' '}
            </p>
            <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoBox>
                <h4 className="font-semibold">Stripe (Pagos)</h4>
                <p className="text-sm mt-2">
                  Utilizado para procesar pagos de forma segura y para la
                  prevención del fraude.{' '}
                </p>
                <a
                  href="https://stripe.com/cookies-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 block"
                >
                  Ver política de Stripe
                </a>
              </InfoBox>
              <InfoBox>
                <h4 className="font-semibold">Vercel Analytics</h4>
                <p className="text-sm mt-2">
                  Utilizado para obtener analíticas de rendimiento y uso de la
                  aplicación.
                </p>
                <a
                  href="https://vercel.com/docs/analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline mt-2 block"
                >
                  Ver documentación de Vercel
                </a>
              </InfoBox>
            </div>
          </LegalSection>

          <LegalSection id="gestion-cookies" title="5. Gestión de Cookies">
            <InfoBox variant="destructive">
              <div className="flex items-start">
                <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Su control sobre las Cookies</h4>
                  <p className="text-sm">
                    En su primera visita, le pediremos consentimiento para
                    utilizar cookies no esenciales. Puede cambiar sus
                    preferencias en cualquier momento desde nuestro banner de
                    cookies o en la configuración de su navegador. Desactivar
                    las cookies esenciales puede afectar al funcionamiento del
                    sitio.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection
            id="actualizaciones"
            title="6. Actualizaciones de esta Política"
          >
            <p>
              Podemos actualizar esta política para reflejar cambios en nuestras
              prácticas o por nuevos requisitos legales. Publicaremos cualquier
              cambio en esta página, y la fecha de &quot;Última
              actualización&quot; indicará la versión vigente.
            </p>
          </LegalSection>

          <LegalSection id="contacto" title="7. Contacto">
            <p>
              Si tiene preguntas sobre nuestro uso de cookies, puede
              contactarnos en{' '}
              <a
                href="mailto:privacy@promption.com"
                className="text-primary hover:underline"
              >
                privacy@promption.com
              </a>
              .
            </p>
          </LegalSection>
        </main>
      </LegalPageLayout>
    </div>
  );
} 