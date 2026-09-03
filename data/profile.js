/**
 * Identidade da marca pessoal.
 * Fonte dos números: perfil público do Instagram (@thaynarastefanny).
 * Atualize `stats` sempre que os números mudarem — eles são exibidos em
 * mais de uma seção e vêm todos daqui.
 */
export const profile = {
  name: 'Thaynara Stéfanny',
  handle: '@thaynarastefanny',
  role: 'Reconstrução de Identidade',
  site: 'thaynarastefanny.com.br',
  siteUrl: 'https://thaynarastefanny.com.br/',

  // Frase de abertura do site (hero)
  hero: {
    line1: 'Há uma mulher',
    line2: 'que as redes conhecem.',
    line3: 'E há uma história',
    line4: 'que veio antes delas.',
    lead:
      'Você chegou até aqui por um perfil. O que vem a seguir é o que existia antes dele — e o que nasceu depois.',
    scrollCue: 'Continue',
  },

  portrait: {
    src: '/img/thaynara-retrato.jpg',
    alt: 'Retrato de Thaynara Stéfanny em fundo escuro, vestindo preto.',
  },

  stats: [
    { id: 'followers', value: '385 mil', label: 'pessoas no Instagram' },
    { id: 'posts', value: '824', label: 'publicações' },
    { id: 'community', value: '2,9 mil', label: 'membros na comunidade' },
  ],
}
