# HS CAR'S — Experiência Digital

Mini experiência digital para o link da bio do Instagram da **HS CAR'S**
(@hscarsofc) — Santana de Parnaíba, SP.

O objetivo não é um agregador de links: é converter visitantes do Instagram em
conversas qualificadas no WhatsApp, com a percepção de uma boutique automotiva.

---

## Publicar na Netlify

O projeto é exportado como **HTML estático** — sem função serverless, sem cold
start, tudo servido pelo CDN.

**Pelo painel:** conecte o repositório e a Netlify lê o `netlify.toml` sozinha.
Nada para configurar à mão.

| Campo             | Valor           |
| ----------------- | --------------- |
| Build command     | `npm run build` |
| Publish directory | `out`           |
| Node version      | `22`            |

**Pela CLI:**

```bash
npm install
npm run build
npx netlify deploy --prod --dir=out
```

Depois é só apontar o link da bio do Instagram para a URL publicada.

---

## Os dados da loja já estão no ar

Tudo em `config/siteConfig.ts`, com os valores reais:

| Item                | Valor                                            |
| ------------------- | ------------------------------------------------ |
| WhatsApp            | `5511947078010`                                   |
| Estoque             | `https://hscarsofc.com.br`                        |
| Perfil no Google    | `https://share.google/yZM35KG5WBsun5csP`          |
| Reputação           | 4,9 · 35 avaliações                               |
| Depoimentos         | 3 transcrições públicas do Google                 |
| Endereço            | Estrada Tenente Marques, 3600A · Vila Poupança    |
| CEP                 | 06530-001                                         |
| Horário             | Segunda a sábado, 08:30–18:00 · domingo fechado   |

Qualquer um deles pode ser trocado por variável de ambiente no painel da
Netlify, sem novo commit — ver `.env.example`.

### Sobre os depoimentos

São transcrições literais das avaliações públicas do Google, sem reescrita.
As únicas alterações foram remover emojis, marcar cortes com `[…]` e acertar
acentuação. A avaliação de Thamires Aparecida foi deixada de fora de
propósito: ela é citada como parte da equipe em outra avaliação, e usá-la
como prova social seria enganoso.

Quando chegarem avaliações novas, atualize `googleRating`,
`googleReviewsCount` e o array `reviews` — nessa ordem de importância.

---

## Stack

| Camada    | Escolha                                  |
| --------- | ---------------------------------------- |
| Framework | Next.js 15 (App Router) + TypeScript      |
| Estilo    | Tailwind CSS 3 com design system próprio  |
| Movimento | Framer Motion                             |
| Ícones    | Lucide                                    |
| Tipografia| Manrope (next/font, self-hosted)          |

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

Deploy: Netlify (`netlify.toml` já define build, publish, cabeçalhos e cache).

---

## Arquitetura

```
app/          rotas, metadata, SEO, sitemap, robots, manifest, OG image
components/   primitivas compartilhadas (Modal, Field, Reveal, Header…)
sections/     as seções da página, na ordem em que aparecem
forms/        Concierge (6 etapas), Vender, Trocar
lib/          whatsapp, analytics, máscaras/validação, webhook de leads
config/       siteConfig.ts — a única fonte de verdade editável
```

### `config/siteConfig.ts`

Concentra marca, endereço, horários, links, reputação e IDs de medição.
Cada campo aceita sobrescrita por variável de ambiente `NEXT_PUBLIC_*`
(ver `.env.example`), então dá para mudar número, links e pixels sem tocar
em código.

---

## Design system

Paleta oficial da marca, sem invenção:

| Token          | Hex       | Papel                                    |
| -------------- | --------- | ---------------------------------------- |
| `ink`          | `#000000` | fundo dominante                          |
| `ink-soft`     | `#0D0D0D` | alternância entre seções                 |
| `ink-raised`   | `#111111` | superfícies elevadas                     |
| `ink-graphite` | `#1A1A1A` | grafite                                  |
| `ink-charcoal` | `#36454F` | cinza carvão (só em luz de ambiente)     |
| `bone`         | `#FFFFFF` | tipografia                               |
| `gold`         | `#CFA060` | joia visual — nunca superfície            |

Regras que o código segue:

- **O dourado não domina.** Aparece em fios, índices, estados ativos, um ponto
  final. Nenhuma área grande é preenchida com ele.
- **Fios finíssimos** em vez de cards. `--hairline` (branco a 8%) é a cor de
  borda padrão de qualquer elemento.
- **Grão fotográfico** global a 5% elimina banding nos gradientes escuros.
- **Malha arquitetônica** de colunas a 4% sustenta a composição no desktop.
- **Contraste**: nenhum texto abaixo de 50% de branco sobre preto — o piso do
  WCAG AA (4,5:1) para corpo de texto.

---

## Fluxos de captação

### Concierge (6 ou 7 etapas)

Formulário multi-etapas com validação por etapa, máscaras de telefone, KM,
moeda e ano, e consentimento LGPD explícito (nunca pré-marcado). Ao concluir:
mostra a confirmação, monta a mensagem estruturada e abre o WhatsApp.

**Triagem de crédito condicional.** Quem escolhe *Financiamento* ou
*Veículo + diferença* ganha uma sétima etapa; quem paga à vista nunca a vê.
São cinco perguntas de toque único, todas por faixa:

| Pergunta               | Por que o vendedor precisa                                  |
| ---------------------- | ----------------------------------------------------------- |
| Entrada disponível     | É a alavanca que mais muda a aprovação e o valor da parcela  |
| Faixa de renda         | Define o teto de parcela que o banco aceita                  |
| Comprovação de renda   | Decide qual banco e quais documentos entram na ficha          |
| Situação do nome       | Filtro mais decisivo da pré-análise                          |
| Já tem crédito aprovado| Separa o lead pronto para fechar de quem ainda vai analisar   |

O bloco `PERFIL PARA FINANCIAMENTO` entra na mensagem do WhatsApp, então o
consultor abre a conversa já sabendo o cenário.

**O que deliberadamente não é pedido aqui:** CPF, data de nascimento, nome da
mãe, comprovantes. São exatamente os dados que o banco exige — e exatamente os
que uma página pública não deve carregar. Três motivos: a mensagem trafega pela
URL do WhatsApp (histórico do navegador, logs); pedir documento antes da
primeira conversa derruba a conversão; e guardar CPF cria obrigação de LGPD que
o site não precisa assumir. Esses dados são do consultor, na conversa, quando a
proposta avançar.

### Vender / Trocar

Modais independentes com foco preso, fechamento por `Esc`, restauração do foco
e `inert` no restante da página. Cada um gera sua própria mensagem.

Todas as mensagens são montadas em `lib/whatsapp.ts` a partir de blocos: campos
opcionais em branco desaparecem sem deixar linhas órfãs.

---

## Analytics

`lib/analytics.ts` empurra tudo para o `dataLayer`, então GTM, GA4 e Meta Pixel
podem ser plugados depois sem tocar em componente. Nenhum script de terceiro é
carregado enquanto os IDs estiverem vazios.

Eventos: `page_view_biolink`, `click_whatsapp`, `click_instagram`,
`click_google_profile`, `click_maps`, `click_inventory`, `start_car_finder`,
`car_finder_step_01`…`car_finder_step_06`, `car_finder_credit_profile`,
`car_finder_completed`,
`click_sell_car`, `sell_car_completed`, `click_trade_car`,
`trade_car_completed`.

Para espelhar leads em um CRM, defina `NEXT_PUBLIC_LEAD_WEBHOOK_URL` — o envio
é feito por `sendBeacon` e nunca bloqueia a jornada.

---

## SEO e dados locais

- `title`, `description`, canonical, OpenGraph e Twitter Card em `app/layout.tsx`
- Imagem social em `app/opengraph-image.png` (1200×630, gerada a partir da marca)
- `sitemap.xml`, `robots.txt` e `manifest.webmanifest` gerados pelo App Router
- Schema.org **AutoDealer** + **WebSite** em `components/StructuredData.tsx`,
  com endereço, horários e áreas atendidas. Latitude, longitude, telefone e
  nota do Google entram automaticamente quando configurados.

---

## Privacidade

Coletamos nome, WhatsApp, interesse comercial e — só no caminho de
financiamento — faixas de entrada, renda e situação de crédito. A página
`/privacidade` explica base legal, uso, compartilhamento, prazo e direitos do
titular, e deixa claro que nenhuma consulta a birô é feita a partir do site.

O consentimento é um checkbox real, obrigatório e nunca pré-marcado. Seu texto
muda conforme o caminho: quem financia autoriza explicitamente a pré-análise.

O Google Maps só é carregado depois que a pessoa clica — nada de terceiro roda
antes disso.

---

## Acessibilidade

- Alvos de toque ≥ 44px em toda a interface mobile
- Foco visível em dourado, nunca removido
- `radiogroup` reais, `label` reais, `aria-describedby` nos erros
- `role="alert"` nas mensagens de validação e `aria-live` nas transições
- Foco preso e restaurado nos modais; página inerte ao fundo
- `prefers-reduced-motion` desliga todo o movimento
- Skip link para o formulário

---

## O que ainda depende do cliente

| Item                   | Onde entra                              |
| ---------------------- | --------------------------------------- |
| Latitude / longitude   | `address.latitude`, `address.longitude` |
| E-mail comercial       | `email`                                 |
| Fotografia do hero     | `heroImage`                             |
| GTM / GA4 / Meta Pixel | `analytics`                             |
| Webhook de CRM         | `leadWebhookUrl`                        |

Nenhum deles bloqueia nada: sem esses dados a página continua completa e
coerente — ela simplesmente não afirma o que não pode provar.
