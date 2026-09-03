import Image from 'next/image'
import mark from '@/public/brand/hscars-mark.png'

const RADIAL = 'radial-gradient(76% 74% at 50% 40%, #000 20%, rgba(0,0,0,0.5) 56%, transparent 86%)'
const VERTICAL = 'linear-gradient(to bottom, transparent 0%, #000 18%, #000 62%, transparent 96%)'

/**
 * A silhueta da marca usada como elemento arquitetônico.
 *
 * É o mesmo desenho do logotipo oficial — não redesenhado, não alterado —
 * apenas ampliado e rebaixado a ponto de funcionar como relevo na superfície
 * preta. Duas máscaras aninhadas dissolvem as bordas, para que a forma pareça
 * emergir do escuro em vez de ser recortada.
 *
 * Aparece uma única vez na página, de propósito.
 */
export function BrandSilhouette({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      aria-hidden
      style={{ WebkitMaskImage: VERTICAL, maskImage: VERTICAL }}
    >
      <div style={{ WebkitMaskImage: RADIAL, maskImage: RADIAL }}>
        <Image
          src={mark}
          alt=""
          priority={false}
          sizes="(max-width: 768px) 200vw, 120vw"
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}
