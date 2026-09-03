/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  /**
   * A página inteira é estática: não há rota dinâmica, server action nem
   * leitura de request. Exportar HTML puro entrega o melhor cenário possível
   * na Netlify — sem runtime serverless, sem cold start, tudo servido do CDN.
   * Cabeçalhos e cache ficam em netlify.toml, já que `headers()` não se
   * aplica a um export estático.
   */
  output: 'export',

  images: {
    // O otimizador de imagens exige servidor; aqui os arquivos já são
    // pequenos e servidos direto do CDN.
    unoptimized: true,
  },

  trailingSlash: false,
}

export default nextConfig
