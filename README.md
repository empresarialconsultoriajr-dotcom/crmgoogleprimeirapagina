# HS CAR'S — Experiência Digital

Mini experiência digital para o link da bio do Instagram da **HS CAR'S**
(@hscarsofc) — Santana de Parnaíba, SP.

O objetivo não é um agregador de links: é converter visitantes do Instagram em
conversas qualificadas no WhatsApp, com a percepção de uma boutique automotiva.

---

## Antes de publicar — 1 campo obrigatório

Abra `config/siteConfig.ts` (ou defina as variáveis de ambiente) e substitua:

```ts
whatsappNumber: env('WHATSAPP_NUMBER', '5511XXXXXXXXX'),
```

pelo número real da loja, em formato internacional e **apenas dígitos**
(`55` + DDD + número). Enquanto o placeholder contiver `X`, a interface não
abre um link quebrado: ela copia a mensagem do lead e leva a pessoa ao direct
do Instagram.

Todo o resto é opcional. **Campos vazios escondem o elemento** — nenhum dado é
inventado em lugar nenhum.

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

Deploy: Vercel (`vercel.json` já aponta para o framework Next).

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

### Concierge (6 etapas)

Formulário multi-etapas com validação por etapa, máscaras de telefone, KM,
moeda e ano, e consentimento LGPD explícito (nunca pré-marcado). Ao concluir:
mostra a confirmação, monta a mensagem estruturada e abre o WhatsApp.

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
`car_finder_step_01`…`car_finder_step_06`, `car_finder_completed`,
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

Coletamos nome, WhatsApp e interesse comercial, então a página
`/privacidade` explica base legal, uso, compartilhamento, prazo e direitos do
titular. O consentimento é um checkbox real, obrigatório e nunca pré-marcado.

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

| Item                     | Onde entra                                    |
| ------------------------ | --------------------------------------------- |
| Número do WhatsApp       | `whatsappNumber` — **obrigatório**             |
| Link do estoque          | `stockUrl`                                     |
| Perfil e avaliações Google | `googleProfileUrl`, `googleReviewsUrl`       |
| Nota e nº de avaliações  | `googleRating`, `googleReviewsCount`           |
| Depoimentos reais        | `reviews[]`                                    |
| Latitude / longitude     | `address.latitude`, `address.longitude`        |
| Horário de funcionamento | `openingHours` (valores atuais são presumidos) |
| Fotografia do hero       | `heroImage`                                    |
| GTM / GA4 / Meta Pixel   | `analytics`                                    |

Sem esses dados a página continua completa e coerente — ela simplesmente não
afirma o que ainda não pode provar.
