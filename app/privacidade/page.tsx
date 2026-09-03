import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { siteConfig, fullAddress } from '@/config/siteConfig'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como a HS CAR’S coleta, utiliza e protege os dados informados no site, em conformidade com a LGPD.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacidade' },
}

const SECTIONS = [
  {
    index: '01',
    title: 'Quem é o controlador',
    body: [
      `A ${siteConfig.brandName}, estabelecida em ${fullAddress}, é a controladora dos dados pessoais coletados neste site, nos termos da Lei nº 13.709/2018 (LGPD).`,
    ],
  },
  {
    index: '02',
    title: 'Quais dados coletamos',
    body: [
      'Coletamos apenas o que você informa voluntariamente nos formulários: nome, telefone de WhatsApp e as preferências relacionadas ao veículo — marca, modelo, ano, cor, faixa de investimento, forma de pagamento, dados de um eventual veículo para troca, prazo de compra e observações.',
      'Se você indicar que pretende financiar, pedimos também informações por faixa para uma pré-análise: valor de entrada disponível, faixa de renda mensal, forma de comprovação de renda, situação do seu nome e se você já possui crédito aprovado em algum banco. São faixas, nunca valores exatos.',
      'Não solicitamos CPF, data de nascimento, dados bancários, documentos, comprovantes ou qualquer informação sensível neste site. Se a negociação avançar e o banco exigir esses documentos, eles são tratados diretamente com o consultor, fora daqui.',
    ],
  },
  {
    index: '03',
    title: 'Para que utilizamos',
    body: [
      'Os dados são utilizados exclusivamente para entrar em contato com você por WhatsApp, entender o que procura e apresentar veículos compatíveis com o seu interesse.',
      'As informações de financiamento servem para uma leitura preliminar das condições — orientar qual instituição financeira faz sentido e qual faixa de parcela cabe no seu orçamento — antes mesmo da primeira conversa. Nenhuma consulta a birô de crédito é feita a partir deste site, e nenhuma decisão automatizada é tomada sobre você.',
      'A base legal é o seu consentimento, coletado de forma explícita e nunca pré-marcada, e o legítimo interesse na condução do atendimento comercial que você solicitou.',
    ],
  },
  {
    index: '04',
    title: 'Com quem compartilhamos',
    body: [
      'As informações são tratadas pela equipe comercial da HS CAR’S. Podem transitar por ferramentas de atendimento e mensageria (como o WhatsApp) e, quando aplicável, por sistemas de gestão de relacionamento contratados pela loja.',
      'Não vendemos, alugamos nem cedemos seus dados a terceiros para fins publicitários.',
    ],
  },
  {
    index: '05',
    title: 'Por quanto tempo guardamos',
    body: [
      'Mantemos os dados pelo tempo necessário ao atendimento e, depois disso, pelo prazo exigido por obrigações legais. Encerrada essa necessidade, os dados são eliminados.',
    ],
  },
  {
    index: '06',
    title: 'Cookies e medição',
    body: [
      'Este site não usa cookies para funcionar. Ferramentas de medição de audiência só são carregadas quando configuradas pela loja, e o mapa do Google é carregado apenas quando você clica para abri-lo.',
      'As informações dos formulários não ficam armazenadas neste site: elas são montadas em uma mensagem e enviadas por você, pelo seu próprio WhatsApp, no momento em que você toca no botão final.',
    ],
  },
  {
    index: '07',
    title: 'Seus direitos',
    body: [
      'Você pode solicitar a qualquer momento a confirmação do tratamento, o acesso, a correção, a portabilidade, a anonimização ou a exclusão dos seus dados, além de revogar o consentimento.',
      'Para exercer qualquer um desses direitos, basta escrever para a HS CAR’S pelos canais de contato do site.',
    ],
  },
] as const

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink pb-28 pt-12 md:pb-32 md:pt-16">
      <div className="shell max-w-3xl">
        <Link
          href="/"
          className="link-quiet min-h-[44px] py-2 text-[11px] uppercase tracking-[0.2em]"
          aria-label="Voltar para a página inicial"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden />
          Voltar
        </Link>

        <div className="mt-14 flex items-center gap-5">
          <Logo width={120} className="h-auto w-[104px]" />
        </div>

        <h1 className="display mt-12 text-[clamp(1.9rem,7vw,3rem)]">Política de Privacidade</h1>
        <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-bone/60">
          Este documento explica, sem rodeios, quais dados a {siteConfig.brandName} coleta neste site, por que
          coleta e o que você pode pedir a qualquer momento.
        </p>

        <div className="mt-16">
          {SECTIONS.map((section) => (
            <section key={section.index} className="border-t border-bone/8 py-10 md:py-12">
              <div className="flex items-center gap-3">
                <span className="label-gold tabular-nums">{section.index}</span>
                <span className="h-px w-5 bg-gold/40" aria-hidden />
              </div>
              <h2 className="display mt-6 text-[clamp(1.15rem,4.5vw,1.5rem)]">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-5 max-w-prose text-[14px] leading-[1.85] text-bone/60 md:text-[15px]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-bone/8 pt-8 text-[12px] tracking-[0.1em] text-bone/50">
          © {new Date().getFullYear()} {siteConfig.brandName}. {siteConfig.tagline}.
        </p>
      </div>
    </main>
  )
}
