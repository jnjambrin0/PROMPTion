import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  UserCheck,
  CreditCard,
  Ban,
  CheckCircle,
  ShieldQuestion,
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
  title: 'Términos de Uso | Promption',
  description: 'Lee nuestros Términos de Uso para entender tus derechos y responsabilidades al usar Promption.'
}

const sections = [
  { id: 'aceptacion', title: '1. Aceptación de los Términos' },
  { id: 'descripcion-servicio', title: '2. Descripción del Servicio' },
  { id: 'requisitos-uso', title: '3. Requisitos de Uso' },
  { id: 'planes-pagos', title: '4. Planes y Pagos' },
  { id: 'uso-aceptable', title: '5. Uso Aceptable' },
  { id: 'contenido-usuario', title: '6. Contenido del Usuario' },
  { id: 'propiedad-intelectual', title: '7. Propiedad Intelectual' },
  { id: 'privacidad-datos', title: '8. Privacidad y Datos' },
  { id: 'limitacion-responsabilidad', title: '9. Limitación de Responsabilidad' },
  { id: 'modificaciones', title: '10. Modificaciones' },
  { id: 'terminacion', title: '11. Terminación' },
  { id: 'disposiciones-generales', title: '12. Disposiciones Generales' },
  { id: 'contacto', title: '13. Contacto' },
]

const pricingPlans = [
  {
    name: 'Gratuito',
    price: '0€',
    features: ['100 prompts', '1 workspace', 'Funciones básicas'],
  },
  {
    name: 'Pro',
    price: '9€/mes',
    features: ['Prompts ilimitados', '5 workspaces', 'Colaboración'],
  },
  {
    name: 'Team',
    price: '29€/mes',
    features: ['Todo Pro', '10 miembros', 'Analíticas avanzadas'],
  },
  {
    name: 'Enterprise',
    price: 'Contactar',
    features: ['Personalizado', 'SSO', 'SLA garantizado'],
  },
]

const prohibitedUses = [
  'Violar leyes aplicables o derechos de terceros.',
  'Usar el Servicio para actividades ilegales o fraudulentas.',
  'Intentar acceder sin autorización a sistemas o datos de Promption.',
  'Realizar ingeniería inversa, descompilar o extraer datos masivamente.',
  'Sobrecargar o interferir con el funcionamiento del Servicio.',
  'Revender o sublicenciar el acceso sin nuestra autorización expresa.',
  'Usar la plataforma para desarrollar servicios que compitan directamente.',
  'Almacenar o compartir contenido ilegal, ofensivo o que infrinja derechos.',
]

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="mt-8 text-center">

        <LegalPageHeader
          title="Términos de Uso"
          lastUpdated="18 de junio, 2025"
          />
          </div>
        <LegalPageLayout
        nav={
          <LegalContentNavigator sections={sections} title="Navegación Rápida" />
        }
      >

        <main className="mt-8">
          <LegalSection id="aceptacion" title="1. Aceptación de los Términos">
            <InfoBox>
              <div className="flex items-start">
                <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Acuerdo Vinculante</h4>
                  <p className="text-sm">
                    Al acceder y utilizar Promption (&quot;el Servicio&quot;, &quot;la
                    Plataforma&quot;), usted acepta estar legalmente vinculado por estos
                    Términos de Uso (&quot;Términos&quot;). Si no está de acuerdo con
                    alguna parte de los términos, no debe utilizar nuestro
                    Servicio.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection id="descripcion-servicio" title="2. Descripción del Servicio">
            <p>
              Promption es una plataforma de gestión de prompts para
              Inteligencia Artificial que permite a los usuarios y equipos
              crear, organizar, gestionar, colaborar y optimizar prompts,
              plantillas y configuraciones para diversos agentes de IA.
            </p>
          </LegalSection>

          <LegalSection id="requisitos-uso" title="3. Requisitos de Uso">
            <div className="grid gap-6 md:grid-cols-2">
              <LegalCard
                Icon={UserCheck}
                title="Elegibilidad"
                description="Debe tener al menos 18 años y plena capacidad legal para aceptar estos Términos."
              />
              <LegalCard
                Icon={UserCheck}
                title="Seguridad de la Cuenta"
                description="Es su responsabilidad proporcionar información veraz, mantener la confidencialidad de sus credenciales y notificar cualquier uso no autorizado."
              />
            </div>
          </LegalSection>

          <LegalSection id="planes-pagos" title="4. Planes y Pagos">
            <p>
              Ofrecemos varios planes de suscripción para adaptarnos a sus
              necesidades. Los pagos se procesan de forma segura a través de
              Stripe y se renuevan automáticamente a menos que se cancelen.
            </p>
            <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pricingPlans.map((plan) => (
                <LegalCard
                  key={plan.name}
                  title={plan.name}
                  description={plan.price}
                  features={plan.features}
                />
              ))}
            </div>
            <InfoBox variant="destructive">
              <div className="flex items-start">
                <CreditCard className="mr-3 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Política de No Reembolso</h4>
                  <p className="text-sm">
                    No se ofrecen reembolsos ni devoluciones por los pagos
                    realizados. La cancelación de una suscripción evitará cargos
                    futuros, y podrá seguir utilizando el servicio hasta el
                    final del período de facturación pagado.
                  </p>
                </div>
              </div>
            </InfoBox>
          </LegalSection>

          <LegalSection id="uso-aceptable" title="5. Uso Aceptable">
            <p>
              Para mantener la integridad y seguridad de la plataforma, todos
              los usuarios deben adherirse a nuestra política de uso aceptable.
            </p>
            <div className="my-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-destructive">
                  <Ban className="mr-2 h-5 w-5" />
                  Usos Prohibidos
                </h3>
                <ul className="space-y-2 text-sm text-destructive/90">
                  {prohibitedUses.map((use, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 font-mono">›</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-green-600/20 bg-green-500/10 p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-green-700 dark:text-green-400">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Uso Responsable
                </h3>
                <p className="text-sm text-green-800/90 dark:text-green-300/90">
                  Usa Promption de manera ética y responsable. Respeta la
                  propiedad intelectual, la privacidad de otros usuarios y
                  contribuye a mantener una comunidad segura y positiva. El
                  incumplimiento de estos términos puede resultar en la
                  suspensión o terminación de su cuenta.
                </p>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="contenido-usuario" title="6. Contenido del Usuario">
            <p>
              Usted mantiene todos los derechos sobre el contenido que crea y
              sube a la plataforma. Al usar el servicio, nos otorga una licencia
              limitada, no exclusiva y mundial para almacenar, mostrar y
              procesar su contenido, únicamente con el fin de proporcionarle el
              Servicio.
            </p>
          </LegalSection>
          
          <LegalSection id="propiedad-intelectual" title="7. Propiedad Intelectual">
              <p>El Servicio, incluyendo su software, diseño, logos y contenido original (excluyendo el contenido del usuario), es propiedad exclusiva de Promption y está protegido por las leyes de propiedad intelectual y derechos de autor.</p>
          </LegalSection>
          
          <LegalSection id="privacidad-datos" title="8. Privacidad y Datos">
             <InfoBox>
                <div className="flex items-start">
                    <ShieldQuestion className="mr-3 h-5 w-5 flex-shrink-0"/>
                    <div>
                        <h4 className="font-semibold">Política de Privacidad</h4>
                        <p className="text-sm">
                        El tratamiento de sus datos personales se rige por nuestra <Link href="/privacy" className="font-medium text-primary hover:underline">Política de Privacidad</Link>, que forma parte integral de estos Términos.
                        </p>
                    </div>
                </div>
             </InfoBox>
          </LegalSection>

          <LegalSection id="limitacion-responsabilidad" title="9. Limitación de Responsabilidad">
              <p>El Servicio se proporciona &quot;tal cual&quot;. En la máxima medida permitida por la ley, Promption no será responsable por daños indirectos, y nuestra responsabilidad total no excederá la cantidad que usted nos haya pagado en los últimos 12 meses.</p>
          </LegalSection>

          <LegalSection id="modificaciones" title="10. Modificaciones">
              <p>Nos reservamos el derecho de modificar estos Términos o el Servicio en cualquier momento. Notificaremos los cambios significativos con antelación. El uso continuado del Servicio después de los cambios constituye su aceptación.</p>
          </LegalSection>

          <LegalSection id="terminacion" title="11. Terminación">
              <p>Usted puede cancelar su cuenta en cualquier momento. Nosotros podemos suspender o terminar su acceso por violación de estos Términos, inactividad prolongada o requerimiento legal. Las cláusulas que por su naturaleza deban sobrevivir a la terminación (como las de propiedad y limitación de responsabilidad) lo harán.</p>
          </LegalSection>

          <LegalSection id="disposiciones-generales" title="12. Disposiciones Generales">
              <p>Estos Términos se rigen por las leyes de España, y cualquier disputa se someterá a los tribunales de Madrid. Para los consumidores de la UE, está disponible la plataforma de resolución de litigios en línea.</p>
          </LegalSection>
          
          <LegalSection id="contacto" title="13. Contacto">
            <div className="mt-6 text-center">
              <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">¿Dudas sobre los Términos?</h3>
              <p className="mt-2 text-muted-foreground">
                Si tiene alguna consulta sobre estos Términos de Uso,
                contacte a nuestro equipo legal.
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
  )
}