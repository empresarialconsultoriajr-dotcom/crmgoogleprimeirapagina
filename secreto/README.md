# SECRETO — 10 dias de consagração

Painel pessoal e privado para dez dias de consagração (19/10/2026 a 28/10/2026): rotina da manhã guiada, leituras bíblicas com contexto, diário espiritual e emocional, revisão noturna, jejum digital, apoio em momentos de ansiedade, área de reflexão sobre o relacionamento, trabalho e DClin, progresso e plano de continuidade de 30 dias.

## Como executar

Não há build nem dependências. É uma aplicação web estática (HTML, CSS e JavaScript em módulos).

Em qualquer computador com Python:

```bash
cd secreto
python3 -m http.server 8080
```

Depois abra `http://localhost:8080` no navegador. Abrir o `index.html` diretamente como arquivo não funciona por causa dos módulos JavaScript; é preciso servir por HTTP.

## Como publicar (para usar no iPhone)

Qualquer hospedagem de arquivos estáticos serve, por exemplo Vercel, Netlify, GitHub Pages ou Cloudflare Pages. O conteúdo a publicar é a pasta `secreto/` inteira.

Na Vercel, ao importar este repositório, defina **Root Directory** como `secreto`, **Framework Preset** como *Other* e deixe o comando de build vazio. O `vercel.json` na raiz do repositório pertence ao projeto antigo (Vite) e não se aplica a esta pasta.

Com a aplicação publicada em HTTPS, no iPhone: abra o endereço no Safari, toque em **Compartilhar** e em **Adicionar à Tela de Início**. Ela abre em tela cheia, como aplicativo, e funciona off-line depois da primeira visita.

## Onde ficam os dados (importante)

- Todos os registros ficam no armazenamento local do navegador (`localStorage`), somente naquele aparelho e naquele navegador.
- Não há conta, servidor, sincronização nem envio de dados a terceiros. Nenhuma chave ou credencial é usada.
- Limpar os dados do Safari, usar aba privada ou trocar de aparelho faz os registros desaparecerem. No iPhone, um site adicionado à Tela de Início mantém os dados de forma mais estável do que uma aba comum do Safari.
- Faça backup em **Mais → Ajustes e backup → Backup completo (JSON)** com regularidade. O mesmo lugar permite importar o backup e exportar os registros em texto legível.

## Estrutura

```
secreto/
  index.html              entrada
  manifest.webmanifest    PWA (instalável)
  sw.js                   cache off-line
  css/styles.css          identidade visual
  js/app.js               casca, rotas, estado de salvamento
  js/store.js             persistência local e exportação
  js/dates.js             datas no fuso de São Paulo
  js/progress.js          indicadores calculados dos registros
  js/ui.js                componentes reutilizáveis
  js/data/days.js         conteúdo dos dez dias
  js/data/content.js      textos dos módulos de apoio
  js/views/*.js           telas
```

## Limites assumidos

- O sistema não envia mensagens, não acessa redes sociais nem se conecta a serviços externos. Apenas as fontes tipográficas são carregadas do Google Fonts.
- Não diagnostica nem substitui acompanhamento psicológico. Se a dificuldade emocional persistir, procure ajuda profissional.
