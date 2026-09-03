import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { siteConfig, fullAddress } from '@/config/siteConfig'
import { FlowsProvider } from '@/components/FlowsProvider'
import { FlowModals } from '@/components/FlowModals'
import { AppShell } from '@/components/AppShell'
import { Analytics } from '@/components/Analytics'
import { StructuredData } from '@/components/StructuredData'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700'],
})

const title = `${siteConfig.brandName} | Seminovos e Usados em ${siteConfig.address.city}`
const description =
  'Encontre seu próximo veículo na HS CAR’S. Seminovos selecionados, atendimento personalizado e uma experiência premium em Santana de Parnaíba.'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s | ${siteConfig.brandName}`,
  },
  description,
  applicationName: siteConfig.brandName,
  keywords: [
    'carros seminovos Santana de Parnaíba',
    'carros usados Santana de Parnaíba',
    'agência de carros Santana de Parnaíba',
    'HS CAR’S',
    'comprar carro seminovo SP',
    'avaliação de veículo',
    'troca de carro',
  ],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  publisher: siteConfig.brandName,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.siteUrl,
    siteName: siteConfig.brandName,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  icons: {
    icon: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  category: 'automotive',
  other: {
    'geo.region': `BR-${siteConfig.address.state}`,
    'geo.placename': siteConfig.address.city,
    'business:contact_data:street_address': siteConfig.address.street,
    'business:contact_data:locality': siteConfig.address.city,
    'business:contact_data:region': siteConfig.address.state,
    'business:contact_data:country_name': 'Brasil',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        {/* Sem JavaScript, nada de conteúdo preso no estado inicial da animação. */}
        <noscript>
          <style>{`.reveal,.enter,[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain">
        <a
          href="#concierge"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-bone focus:px-5 focus:py-3 focus:text-[12px] focus:uppercase focus:tracking-[0.2em] focus:text-ink"
        >
          Ir para o formulário
        </a>

        <FlowsProvider>
          <AppShell>{children}</AppShell>
          <FlowModals />
        </FlowsProvider>

        <StructuredData />
        <Analytics />

        <span className="sr-only">
          {siteConfig.brandName} — {siteConfig.segment}. {fullAddress}.
        </span>
      </body>
    </html>
  )
}
