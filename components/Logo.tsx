import Image from 'next/image'
import { siteConfig } from '@/config/siteConfig'
import logo from '@/public/brand/hscars-logo.png'

/**
 * Marca oficial, sem redesenho. O arquivo já vem com fundo transparente,
 * então nenhuma máscara ou filtro é aplicado sobre ele.
 */
export function Logo({
  className = '',
  width = 168,
  priority = false,
}: {
  className?: string
  width?: number
  priority?: boolean
}) {
  const ratio = logo.height / logo.width

  return (
    <Image
      src={logo}
      alt={`${siteConfig.brandName} — ${siteConfig.tagline}`}
      width={width}
      height={Math.round(width * ratio)}
      priority={priority}
      sizes={`${width}px`}
      className={className}
    />
  )
}
