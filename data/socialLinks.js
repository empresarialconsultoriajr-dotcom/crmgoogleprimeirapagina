/**
 * socialLinks[] — presença oficial. Acrescente novas redes aqui
 * (YouTube, TikTok, Spotify, LinkedIn) e elas aparecem sozinhas na seção.
 */
export const socialLinks = [
  {
    id: 'instagram',
    active: true,
    order: 1,
    name: 'Instagram',
    handle: '@thaynarastefanny',
    url: 'https://www.instagram.com/thaynarastefanny/',
  },
  {
    id: 'site',
    active: true,
    order: 2,
    name: 'Site oficial',
    handle: 'thaynarastefanny.com.br',
    url: 'https://thaynarastefanny.com.br/',
  },
]

export const activeSocialLinks = socialLinks
  .filter((s) => s.active)
  .sort((a, b) => a.order - b.order)
