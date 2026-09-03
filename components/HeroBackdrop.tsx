import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'

/**
 * Fundo do hero.
 *
 * Sem fotografia contratada, a composição é construída em luz: uma
 * varredura diagonal correndo sobre o preto — o mesmo tratamento da cartela
 * "Preto Sofisticado" da identidade. Definindo siteConfig.heroImage, uma
 * fotografia editorial assume o fundo e a luz permanece como acabamento.
 */
export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {siteConfig.heroImage && (
        <>
          <Image
            src={siteConfig.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
        </>
      )}

      {/* Ambiente: carvão frio na base, calor discreto no alto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(64% 46% at 72% 16%, rgba(207,160,96,0.085), transparent 68%), radial-gradient(85% 62% at 12% 88%, rgba(54,69,79,0.24), transparent 66%)',
        }}
      />

      {/* Varredura larga — não um facho, apenas a lataria mudando de tom */}
      <div className="absolute -inset-[35%] animate-sheen-drift will-change-transform">
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(102deg, transparent 22%, rgba(255,255,255,0.028) 40%, rgba(228,199,154,0.045) 50%, rgba(255,255,255,0.022) 60%, transparent 78%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      {/* Segundo plano de luz, cruzado e ainda mais dissolvido */}
      <div className="absolute -inset-[35%] rotate-[-14deg]">
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(180deg, transparent 30%, rgba(207,160,96,0.04) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      {/* Vinheta e assentamento no preto absoluto */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 92% at 46% 44%, transparent 26%, rgba(0,0,0,0.55) 72%, #000 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />

      {/* Linha de horizonte */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-bone/12 to-transparent" />
    </div>
  )
}
