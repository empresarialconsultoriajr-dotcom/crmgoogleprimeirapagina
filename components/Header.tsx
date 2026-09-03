'use client'

import { useEffect, useRef, useState } from 'react'
import { Instagram } from 'lucide-react'
import { Logo } from './Logo'
import { scrollToId } from './FlowsProvider'
import { siteConfig } from '@/config/siteConfig'
import { track } from '@/lib/analytics'

const NAV = [
  { label: 'Experiência', id: 'experiencia' },
  { label: 'Concierge', id: 'concierge' },
  { label: 'Processo', id: 'processo' },
  { label: 'Localização', id: 'localizacao' },
] as const

export function Header() {
  const [condensed, setCondensed] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /**
   * Publica a altura real do cabeçalho em --header-h.
   * É por ela que os elementos grudados (sticky) e a rolagem entre etapas do
   * formulário sabem onde a área visível de fato começa — em vez de chutar
   * um valor que muda entre celular e desktop.
   */
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const publish = () =>
      document.documentElement.style.setProperty('--header-h', `${Math.round(el.offsetHeight)}px`)

    publish()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', publish)
      return () => window.removeEventListener('resize', publish)
    }
    const observer = new ResizeObserver(publish)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-editorial ${
        condensed ? 'border-b border-bone/8 bg-black/72 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="shell flex items-center justify-between py-4 md:py-5">
        <a
          href="#topo"
          aria-label={`${siteConfig.brandName} — início`}
          className="-my-2 flex min-h-[44px] items-center py-2 transition-opacity duration-500 hover:opacity-80"
        >
          <Logo priority width={124} className="h-auto w-[104px] md:w-[124px]" />
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToId(item.id)}
              className="link-quiet py-2 text-[11px] uppercase tracking-[0.2em]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <a
          href={siteConfig.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('click_instagram', { origin: 'header' })}
          aria-label={`Instagram ${siteConfig.instagramHandle}`}
          className="flex h-11 w-11 items-center justify-center text-bone/70 transition-colors duration-500 hover:text-gold lg:-mr-3"
        >
          <Instagram size={17} strokeWidth={1.25} aria-hidden />
        </a>
      </div>
    </header>
  )
}
