/**
 * featuredContent[] — o "Universo Thaynara": onde a audiência convive com ela
 * no dia a dia (perfil, comunidade e, no futuro, podcast, entrevistas, canal
 * no YouTube, newsletter...).
 *
 * Campos: id, active, order, label (categoria), title, description,
 *         cta { label, url }, external (abre em nova aba), note (linha discreta).
 */
export const featuredContent = [
  {
    id: 'instagram',
    active: true,
    order: 1,
    label: 'Todo dia',
    title: 'Instagram',
    description:
      'Onde a conversa acontece: relacionamentos, autoestima, maternidade e o trabalho diário de se reconhecer de novo.',
    note: '385 mil pessoas',
    cta: { label: 'Seguir @thaynarastefanny', url: 'https://www.instagram.com/thaynarastefanny/' },
    external: true,
  },
  {
    id: 'comunidade',
    active: true,
    order: 2,
    label: 'Comunidade',
    title: 'Além das Redes',
    description:
      'O canal onde eu falo mais perto, sem vitrine e sem plateia. Um espaço para quem quer acompanhar a história de dentro.',
    note: '2,9 mil membros',
    cta: { label: 'Entrar na comunidade', url: 'https://www.instagram.com/thaynarastefanny/' },
    external: true,
  },
]

export const activeContent = featuredContent
  .filter((c) => c.active)
  .sort((a, b) => a.order - b.order)
