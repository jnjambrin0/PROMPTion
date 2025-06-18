import { Metadata } from 'next'
import Link from 'next/link'
import {
  ShieldCheck,
  Database,
  Users,
  Globe,
  Archive,
  BookUser,
  Scale,
  Cookie,
  AlertTriangle,
  Mail,
} from 'lucide-react'

import {
  LegalCard,
  LegalContentNavigator,
  LegalPageHeader,
  LegalPageLayout,
  LegalSection,
  InfoBox,
} from '@/components/legal/legal-components'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Promption',
  description: 'Conoce cómo recopilamos, usamos y protegemos tus datos en Promption. Tu privacidad es nuestra prioridad.'
}

const sections = [
  { id: 'info-general', title: '1. Información General' },
  { id: 'datos-recopilados', title: '2. Datos que Recopilamos' },
  { id: 'base-legal', title: '3. Base Legal y Finalidades' },
  { id: 'comparticion-datos', title: '4. Compartición de Datos' },
  { id: 'conservacion-datos', title: '5. Conservación de Datos' },
  { id: 'derechos-rgpd', title: '6. Sus Derechos (RGPD)' },
  { id: 'seguridad', title: '7. Seguridad' },
  { id: 'cookies', title: '8. Cookies' },
  { id: 'menores', title: '9. Menores de Edad' },
  { id: 'cambios-politica', title: '10. Cambios en esta Política' },
  { id: 'contacto', title: '11. Contacto' },
]

const userRights = [
  {
    icon: BookUser,
    title: 'Acceso',
    description: 'Obtener confirmación y copia de sus datos.',
  },
  {
    icon: Scale,
    title: 'Rectificación',
    description: 'Corregir datos personales inexactos o incompletos.',
  },
  {
    icon: Archive,
    title: 'Supresión (Olvido)',
    description: 'Solicitar la eliminación de sus datos personales.',
  },
  {
    icon: ShieldCheck,
    title: 'Limitación',
    description: 'Restringir el tratamiento de sus datos en ciertos casos.',
  },
  {
    icon: Database,
    title: 'Portabilidad',
    description: 'Recibir sus datos en un formato estructurado y de uso común.',
  },
  {
    icon: Users,
    title: 'Oposición',
    description: 'Oponerse al tratamiento de sus datos por motivos personales.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-background">
      
      <LegalPageLayout
        nav={
          <LegalContentNavigator
            sections={sections}
            title="Navegación Rápida"
          />
        }
      >
        <div className="mt-8">

        <LegalPageHeader
          title="Política de Privacidad"
          lastUpdated="18 de junio, 2025"
          />

          </div>
        <main>
          <LegalSection id="info-general" title="1. Información General">
            <p>
              En Promption (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Plataforma&quot;), accesible
              desde{' '}
              <Link href="https://promption.dev" className="text-primary hover:underline">
                https://promption.dev
              </Link>
              , respetamos su privacidad y nos comprometemos a proteger sus
              datos personales. Esta Política de Privacidad explica cómo
              recopilamos, usamos, compartimos y protegemos su información de
              acuerdo con el Reglamento General de Protección de Datos (RGPD) y
              la Ley Orgánica 3/2018 (LOPD-GDD).
            </p>
            <InfoBox>
              <h4 className="font-semibold">Responsable del Tratamiento</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>
                  <strong>Empresa:</strong> Promption
                </li>
                <li>
                  <strong>Email de contacto:</strong>{' '}
                  <a
                    href="mailto:privacy@promption.com"
                    className="text-primary hover:underline"
                  >
                    privacy@promption.com
                  </a>
                </li>
              </ul>
            </InfoBox>
          </LegalSection>

          <LegalSection id="datos-recopilados" title="2. Datos que Recopilamos">
            <p>
              Recopilamos diferentes tipos de información para proporcionar y
              mejorar nuestro Servicio.
            </p>
            <h3 className="mt-4 text-xl font-semibold">
              2.1 Datos proporcionados directamente
            </h3>
            <ul>
              <li>
                <strong>Información de cuenta:</strong> Dirección de correo
                electrónico.
              </li>
              <li>
                <strong>Información de autenticación:</strong> ID de usuario de
                Supabase Auth.
              </li>
              <li>
                <strong>Información de pago:</strong> Procesada directamente por
                Stripe. No almacenamos datos de tarjetas.
              </li>
            </ul>
            <h3 className="mt-4 text-xl font-semibold">
              2.2 Datos recopilados automáticamente
            </h3>
            <ul>
              <li>
                <strong>Datos de uso:</strong> Interacciones con la plataforma,
                frecuencia de uso, funciones utilizadas.
              </li>
              <li>
                <strong>Datos técnicos:</strong> Dirección IP, tipo de
                navegador, sistema operativo, páginas visitadas.
              </li>
              <li>
                <strong>Cookies y tecnologías similares:</strong> Para mejorar
                la experiencia y analíticas.
              </li>
            </ul>
            <h3 className="mt-4 text-xl font-semibold">
              2.3 Contenido creado por usuarios
            </h3>
            <p>
              Prompts, plantillas, reglas y configuraciones de agentes AI, así
              como comentarios, colaboraciones y sus metadatos asociados.
            </p>
          </LegalSection>

          <LegalSection id="base-legal" title="3. Base Legal y Finalidades">
            <p>
              Tratamos sus datos personales bajo las siguientes bases legales y
              con las siguientes finalidades:
            </p>
            <ul>
              <li>
                <strong>Ejecución de contrato:</strong> Para crear y gestionar
                su cuenta, proporcionar los servicios, procesar pagos y enviar
                comunicaciones del servicio.
              </li>
              <li>
                <strong>Interés legítimo:</strong> Para mejorar nuestros
                servicios, prevenir el fraude, garantizar la seguridad y
                realizar analíticas agregadas de uso.
              </li>
              <li>
                <strong>Cumplimiento legal:</strong> Para cumplir con
                obligaciones fiscales, contables y responder a requerimientos
                legales.
              </li>
            </ul>
          </LegalSection>

          <LegalSection id="comparticion-datos" title="4. Compartición de Datos">
            <p>
              Compartimos sus datos únicamente con proveedores de servicios de
              confianza que nos ayudan a operar la plataforma:
            </p>
            <ul>
              <li>
                <strong>Supabase:</strong> Autenticación y base de datos.
              </li>
              <li>
                <strong>Vercel:</strong> Hosting, analíticas y rendimiento.
              </li>
              <li>
                <strong>Stripe:</strong> Procesamiento de pagos.
              </li>
            </ul>
            <InfoBox>
              <div className="flex items-start">
                <Globe className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Transferencias Internacionales</h4>
                  <p className="text-sm">
                    Para usuarios fuera de la UE y transferencias a proveedores
                    en EE. UU., implementamos Cláusulas Contractuales Estándar y
                    medidas de seguridad adicionales para garantizar la
                    protección de sus datos.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection id="conservacion-datos" title="5. Conservación de Datos">
            <p>
              Conservamos sus datos durante diferentes períodos según su
              naturaleza:
            </p>
            <ul>
              <li>
                <strong>Datos de cuenta y contenido creado:</strong> Mientras
                mantenga su cuenta activa.
              </li>
              <li>
                <strong>Datos de facturación:</strong> 5 años según las
                obligaciones fiscales españolas.
              </li>
              <li>
                <strong>Logs técnicos:</strong> 12 meses.
              </li>
            </ul>
            <p>
              Tras eliminar su cuenta, sus datos serán eliminados en 30 días,
              excepto aquellos que debamos conservar por obligaciones legales.
            </p>
          </LegalSection>

          <LegalSection id="derechos-rgpd" title="6. Sus Derechos (RGPD)">
            <p>
              El RGPD le otorga varios derechos sobre sus datos personales.
              Puede ejercerlos contactándonos en cualquier momento.
            </p>
            <div className="my-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userRights.map((right) => (
                <LegalCard
                  key={right.title}
                  title={right.title}
                  description={right.description}
                  Icon={right.icon}
                />
              ))}
            </div>
          </LegalSection>

          <LegalSection id="seguridad" title="7. Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas apropiadas para
              proteger sus datos, incluyendo:
            </p>
            <ul>
              <li>Cifrado de datos en tránsito (HTTPS/TLS) y en reposo.</li>
              <li>Control de acceso basado en roles.</li>
              <li>Auditorías de seguridad periódicas y formación del personal.</li>
            </ul>
          </LegalSection>

          <LegalSection id="cookies" title="8. Cookies">
            <div className="flex items-start">
              <Cookie className="mr-4 h-8 w-8 flex-shrink-0 text-primary" />
              <div>
                <p>
                  Utilizamos cookies esenciales para el funcionamiento de la
                  plataforma, cookies analíticas para entender el uso del
                  servicio, y cookies de preferencias para recordar sus
                  configuraciones. Puede gestionar las cookies desde la
                  configuración de su navegador.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="menores" title="9. Menores de Edad">
            <InfoBox variant="destructive">
              <div className="flex items-start">
                <AlertTriangle className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Menores de 18 años</h4>
                  <p className="text-sm">
                    Promption no está dirigido a menores de 18 años. No
                    recopilamos intencionalmente datos de menores. Si detectamos
                    que un menor ha creado una cuenta, la eliminaremos
                    inmediatamente.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection id="cambios-politica" title="10. Cambios en esta Política">
            <p>
              Podemos actualizar esta política ocasionalmente. Notificaremos
              cambios significativos por email o mediante un aviso en la
              plataforma. La fecha de &quot;Última actualización&quot; en la parte
              superior de esta página indica la versión vigente.
            </p>
          </LegalSection>

          <LegalSection id="contacto" title="11. Contacto">
            <div className="mt-6 text-center">
              <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">¿Preguntas?</h3>
              <p className="mt-2 text-muted-foreground">
                Si tiene alguna consulta sobre esta Política de Privacidad, no
                dude en contactarnos.
              </p>
              <a
                href="mailto:privacy@promption.com"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contactar con Equipo de Privacidad
              </a>
            </div>
          </LegalSection>
        </main>
      </LegalPageLayout>
    </div>
  )
}
