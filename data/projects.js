/**
 * projects[] — obras, livros, projetos autorais da Thaynara.
 *
 * Para adicionar um novo projeto no futuro (outro livro, evento, palestra,
 * documentário) basta acrescentar um objeto neste array.
 *   - `featured: true`  -> ganha o destaque editorial de página inteira.
 *                          Use em no máximo um projeto por vez.
 *   - `featured: false` -> entra automaticamente na grade "Universo".
 *   - `active: false`   -> some da página sem precisar apagar o conteúdo.
 */
export const projects = [
  {
    id: 'alem-das-redes',
    active: true,
    featured: true,
    order: 1,
    kind: 'livro',
    eyebrow: 'O projeto',
    title: 'Além das Redes',
    tagline: 'A história que o Instagram nunca mostrou.',
    // Abertura editorial — conecta a origem (Instagram) ao conteúdo do livro.
    lead:
      'Antes do feed, dos vídeos e da imagem que você conhece, existiu uma menina que precisou se reconstruir do zero mais de uma vez.',
    body: [
      'Além das Redes é o lugar onde essa história é contada inteira: a maternidade que chegou cedo, as dores que ninguém viu passar, a fé que sustentou o que parecia insustentável e a identidade que precisou ser reerguida peça por peça.',
      'Não é um resumo de perfil. É o que ficou de fora dele.',
    ],
    themes: ['Identidade', 'Maternidade', 'Dor', 'Fé', 'Reconstrução', 'Esperança'],
    cover: {
      // Assim que a arte oficial da capa estiver disponível, coloque o arquivo
      // em public/img/ e informe o caminho aqui (ex.: '/img/capa-alem-das-redes.jpg').
      // Enquanto `image` for null, a capa é composta em CSS a partir das linhas abaixo.
      image: null,
      titleLines: ['Além', 'das', 'Redes'],
      author: 'Thaynara Stéfanny',
    },
    cta: { label: 'Conhecer minha história', url: 'https://thaynarastefanny.com.br/alemdasredes/' },
    urlLabel: 'thaynarastefanny.com.br/alemdasredes',
  },
]

export const featuredProject = projects.find((p) => p.active && p.featured) || null
export const secondaryProjects = projects.filter((p) => p.active && !p.featured)
