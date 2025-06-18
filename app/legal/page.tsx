import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, ShieldCheck, FileText, Mail } from 'lucide-react';

import {
  LegalContentNavigator,
  LegalPageHeader,
  LegalPageLayout,
  LegalSection,
  InfoBox,
} from '@/components/legal/legal-components';

export const metadata: Metadata = {
  title: 'Aviso Legal | Promption',
  description:
    'Información legal sobre Promption, en cumplimiento de la LSSI-CE.',
};

const sections = [
  { id: 'datos-identificativos', title: '1. Datos Identificativos' },
  { id: 'objeto', title: '2. Objeto y Ámbito de Aplicación' },
  { id: 'condiciones-uso', title: '3. Condiciones de Acceso y Uso' },
  { id: 'propiedad-intelectual', title: '4. Propiedad Intelectual' },
  { id: 'responsabilidad', title: '5. Exclusión de Responsabilidad' },
  { id: 'proteccion-datos', title: '6. Protección de Datos' },
  { id: 'cookies', title: '7. Cookies' },
  { id: 'legislacion', title: '8. Legislación y Jurisdicción' },
  { id: 'contacto', title: '9. Contacto' },
];

export default function LegalNoticePage() {
  return (
    <div className="bg-background">
      <LegalPageLayout
        nav={<LegalContentNavigator sections={sections} title="Navegación" />}
      >
        <LegalPageHeader
          title="Aviso Legal"
          lastUpdated="18 de junio, 2025"
        />

        <main>
          <LegalSection
            id="datos-identificativos"
            title="1. Datos Identificativos"
          >
            <p>
              En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de
              la Sociedad de la Información y de Comercio Electrónico
              (LSSI-CE), se informa de los siguientes datos del titular de la
              plataforma Promption:
            </p>
            <InfoBox>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Titular:</strong> Promption Inc. (o nombre legal
                  correspondiente)
                </li>
                <li>
                  <strong>NIF/CIF:</strong> [Número de Identificación Fiscal]
                </li>
                <li>
                  <strong>Dirección:</strong> [Dirección física de la empresa,
                  ej. Madrid, España]
                </li>
                <li>
                  <strong>Email de contacto:</strong>{' '}
                  <a
                    href="mailto:legal@promption.com"
                    className="text-primary hover:underline"
                  >
                    legal@promption.com
                  </a>
                </li>
              </ul>
            </InfoBox>
          </LegalSection>

          <LegalSection id="objeto" title="2. Objeto y Ámbito de Aplicación">
            <p>
              El presente aviso legal regula el uso del sitio web{' '}
              <Link href="/" className="text-primary hover:underline">
                https://promption.dev
              </Link>{' '}
              (en adelante, &quot;el Sitio Web&quot;). La utilización del Sitio Web
              atribuye la condición de usuario e implica la aceptación plena de
              todas las cláusulas y condiciones de uso incluidas en este Aviso
              Legal, así como en nuestros{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Términos de Uso
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection
            id="condiciones-uso"
            title="3. Condiciones de Acceso y Uso"
          >
            <p>
              El usuario se compromete a utilizar el Sitio Web de conformidad
              con la ley, la moral, el orden público y el presente Aviso Legal.
              Se prohíbe explícitamente el uso con fines ilícitos o lesivos, la
              introducción de virus, o cualquier acción que pueda dañar o
              sobrecargar el sistema.
            </p>
          </LegalSection>

          <LegalSection
            id="propiedad-intelectual"
            title="4. Propiedad Intelectual"
          >
            <div className="flex items-start">
              <FileText className="mr-4 h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <p>
                  Todos los contenidos del Sitio Web, incluyendo textos,
                  imágenes, gráficos, logos, software y la marca
                  &quot;Promption&quot;, son propiedad de Promption o de terceros
                  que han autorizado su uso. Queda expresamente prohibida la
                  reproducción, distribución o comunicación pública de los
                  contenidos sin nuestra autorización expresa.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection
            id="responsabilidad"
            title="5. Exclusión de Responsabilidad"
          >
            <p>
              Promption no garantiza la disponibilidad continua del Sitio Web ni
              la ausencia de errores o virus. No nos hacemos responsables por
              daños derivados de la falta de disponibilidad, interrupciones,
              elementos lesivos o del uso inadecuado del Sitio Web. Tampoco
              somos responsables de los contenidos de sitios web de terceros
              enlazados desde nuestra plataforma.
            </p>
          </LegalSection>

          <LegalSection id="proteccion-datos" title="6. Protección de Datos">
            <InfoBox>
              <div className="flex items-start">
                <ShieldCheck className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">
                    Compromiso con la Privacidad
                  </h4>
                  <p className="text-sm">
                    El tratamiento de datos personales se rige por nuestra{' '}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Política de Privacidad
                    </Link>
                    , en estricto cumplimiento con el RGPD y la LOPD-GDD.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection id="cookies" title="7. Cookies">
            <p>
              Utilizamos cookies propias y de terceros para el correcto
              funcionamiento y para analizar el uso de nuestra web. Puede
              obtener información detallada en nuestra{' '}
              <Link href="/cookies" className="text-primary hover:underline">
                Política de Cookies
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection
            id="legislacion"
            title="8. Legislación y Jurisdicción"
          >
            <div className="flex items-start">
              <Scale className="mr-4 h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <p>
                  Este Aviso Legal se rige por la legislación española. Para
                  cualquier controversia que pudiera derivarse de la utilización
                  del Sitio Web, las partes se someten a la jurisdicción de los
                  Juzgados y Tribunales de Madrid, con renuncia expresa a
                  cualquier otro fuero que pudiera corresponderles.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="contacto" title="9. Contacto">
            <div className="mt-6 text-center">
              <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">
                ¿Consultas sobre el Aviso Legal?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Para cualquier duda, puede contactar con nuestro equipo legal.
              </p>
              <a
                href="mailto:legal@promption.com"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contactar con Equipo Legal
              </a>
            </div>
          </LegalSection>
        </main>
      </LegalPageLayout>
    </div>
  );
} 