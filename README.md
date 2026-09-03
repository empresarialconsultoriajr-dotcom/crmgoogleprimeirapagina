# Thaynara Stéfanny — site oficial

Site de marca pessoal (não um agregador de links). React + Vite, sem framework de
CSS e sem dependência de runtime além do React.

```
npm install
npm run dev       # desenvolvimento
npm run build     # gera dist/
npm run preview   # serve o dist/
```

Deploy: Vercel (`vercel.json` já aponta para `dist/`).

---

## A ideia da página

A narrativa é **"das redes para além delas"** e está construída em três camadas —
conteúdo, ordem e cor:

| # | Seção | Registro visual | Papel na narrativa |
|---|-------|-----------------|--------------------|
| 1 | Hero | escuro frio, luz de tela, grade | a pessoa antes de qualquer oferta |
| 2 | Além das Redes | escuro quente | a ponte: você veio pelo perfil, esta é a história de antes |
| 3 | Quem sou | **papel claro** | a virada — sai-se da tela e entra-se no papel |
| 4 | Universo | escuro | onde a conversa continua todo dia |
| 5 | Oportunidades | escuro | o que ela abre para a comunidade |
| 6 | Indicações | escuro | o que ela usa e recomenda |
| 7 | Publicidade | escuro | a porta comercial, para marcas |
| 8 | Redes | escuro | o retorno ao ponto de partida |

Por que nesta ordem: a marca pessoal vem antes das ofertas. Os atalhos do topo são
**âncoras internas**, não links de saída — quem chega do Instagram percorre a
história antes de encontrar qualquer proposta comercial. O contato para marcas fica
no fim de propósito: é a única seção que não fala com a audiência.

A troca de fundo escuro → papel na seção "Quem sou" é a metáfora central, e é um
corte seco, como virar a página.

---

## Como crescer sem mexer no layout

Nenhum link é escrito em JSX. Tudo vem de `data/` e as seções se montam sozinhas.

| Arquivo | O que guarda |
|---------|--------------|
| `data/profile.js` | nome, papel, frase do hero, retrato, números |
| `data/story.js` | o texto de "Quem sou" |
| `data/projects.js` | `projects[]` — livros, projetos autorais |
| `data/featuredContent.js` | `featuredContent[]` — canais do "Universo" |
| `data/opportunities.js` | `opportunities[]` — formações, condições |
| `data/partnerships.js` | `partnerships[]` — marcas indicadas |
| `data/socialLinks.js` | `socialLinks[]` — redes oficiais |
| `data/business.js` | a seção comercial |
| `data/navigation.js` | os atalhos do topo (ids das seções) |

Todos os arrays aceitam:

- `active: false` — some da página sem apagar o conteúdo;
- `order` — posição dentro da seção;
- `featured: true` (só em `projects`) — vira o destaque editorial de página inteira.
  Use em **um** projeto por vez; os demais caem na grade.

Um segundo livro, um evento, um podcast ou uma nova marca parceira entram
acrescentando um objeto ao array correspondente — não é preciso tocar em componente
nem em CSS.

### Capa do livro

Enquanto `projects[].cover.image` for `null`, a capa é composta em CSS (nítida em
qualquer tela, sem depender de mockup). Para usar a arte oficial: coloque o arquivo
em `public/img/` e informe o caminho em `cover.image`.

---

## Regras de conteúdo assumidas no código

Estas regras estão comentadas nos arquivos de dados porque afetam risco jurídico e
manutenção:

1. **Preços não vivem nesta página.** Matrícula, mensalidade e parcelas ficam só no
   checkout, que é a fonte oficial. Aqui usa-se `conditionNote`, que sinaliza sem
   afirmar número — assim a homepage nunca desatualiza.
2. **Nenhum desconto, cupom ou benefício não confirmado.** O campo `benefit` de uma
   parceria só deve ser preenchido com o que a marca confirmar por escrito.
3. **As query strings das parcerias são intocáveis.** `?partner=THAYNARA` é o que
   atribui a indicação. Para campanhas, acrescente `utm_*` ao final — nunca
   substitua o que já existe.

---

## Medição

`lib/track.js` envia cada clique de saída para `window.dataLayer` (GTM) ou `gtag`
(GA4) como evento `outbound_click`, com `link_id` e `link_url`. Sem ferramenta
instalada, não faz nada — a navegação nunca depende da medição. Para ligar, basta
incluir o snippet do GTM ou do GA4 no `index.html`.

---

## Acessibilidade e performance

- Contraste dos textos secundários verificado acima de 4.5:1 em ambos os registros.
- `prefers-reduced-motion` desliga animações, revelações e o scroll suave.
- Skip link, foco visível e `rel="noopener noreferrer"` em todo link externo.
- Sem biblioteca de animação: as revelações usam `IntersectionObserver`, e o
  progresso de leitura é atualizado dentro de `requestAnimationFrame`.
