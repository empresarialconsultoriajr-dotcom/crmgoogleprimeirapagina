# Clube Google Primeira Página · Sistema de controle e auditoria

Aplicação web (React + Vite) que operacionaliza o projeto descrito em
`clube-google-primeira-pagina/Clube-Google-Primeira-Pagina-Projeto-Executivo.pdf`:
cadastro das empresas, registro diário dos colaboradores, auditoria semanal,
Índice de Execução 0–100, alertas automáticos, financeiro, grupos e relatórios.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/ (deploy na Vercel já configurado em vercel.json)
```

Na primeira abertura o sistema carrega **dados de demonstração** (12 empresas, ~75 dias de
registros). Em *Configurações → Limpar tudo* você começa do zero.

## Módulos

| Rota | O que faz |
|---|---|
| `#/` Visão geral | KPIs da rede (ativas, MRR, índice médio, níveis, avaliações, alertas), avaliações por dia, índice por grupo, lista de ação ordenada pelo menor índice. |
| `#/empresas` | Cadastro completo (documento 2), filtros por grupo/status/nível, meta individual calculada pela fórmula `clientes/dia × 20 × 80% × 35%`. |
| `#/empresa/:id` | Painel individual: índice e composição, avaliações × meta (12 meses), posição entre pares, recomendação, registros, checklist de entrada (documento 1), pendências, resumo semanal para WhatsApp. |
| `#/registro` | Registro diário em nome de uma empresa + lista de quem ainda não registrou hoje. |
| `#/registro/CODIGO` | **Link público do colaborador** (sem menu): formulário de 30 s com contagens apenas. Marca campos *Informado* vs *Comprovado*. |
| `#/auditoria` | Auditoria semanal por empresa: números da semana, teste de coerência (conversão 10–60%, picos, retroativos), checklist (documento 6), índice e nível da semana, resumo para sexta-feira. |
| `#/alertas` | Alertas automáticos (inatividade 2/5 dias, negativa sem resposta, queda de resultado, queda de nota, índice < 60 por 2 semanas, pico, pagamento, onboarding lento) com responsável, prazo e tratamento; alertas manuais. |
| `#/financeiro` | Cobranças por competência, MRR/ARR, inadimplência, churn, projeção de caixa 90 dias e fluxo de cancelamento/retenção (documento 10, causas a–e). |
| `#/grupos` | 10 grupos de 10: índice médio, reuniões quinzenais com ata de 3 pontos e presença. |
| `#/relatorios` | Relatório mensal por empresa (documento 7) e relatório da rede, prontos para imprimir em PDF. |
| `#/config` | Pesos do índice, limiares de alertas, parâmetros financeiros, backup (exportar/importar JSON), dados de demonstração. |

## Como o índice é calculado (`src/engine.js`)

| Dimensão | Peso | Fórmula | Natureza |
|---|---|---|---|
| Participação operacional | 25 | dias com registro **no dia** ÷ dias úteis (retroativos não contam) | comprovado |
| Solicitações vs. meta | 20 | solicitações registradas ÷ previstas (meta ÷ 35%) | informado |
| Avaliações vs. meta | 25 | avaliações novas (diferença da contagem do perfil) ÷ meta do período | comprovado |
| Resposta | 15 | respondidas ÷ novas (sem novas = 15) | comprovado |
| Qualidade | 15 | –5 por pendência de treinamento ou inconsistência, –15 por violação | auditoria |

Níveis: **A ≥ 80**, **B 60–79**, **C < 60**. O painel usa o *índice corrente* (últimos 20 dias
úteis); a auditoria usa o índice da semana; os relatórios usam o índice do mês.

## Dados e persistência

Os dados ficam no `localStorage` do navegador (`src/store.js`), com exportação/importação em JSON.
Isso é suficiente para a central operar de um computador. Para que cada colaborador registre do
próprio celular pelo link público, é preciso um backend compartilhado: a camada `store.js`
concentra todas as leituras e gravações, então a troca por Supabase/Firebase/Airtable se faz nesse
único arquivo, mantendo `engine.js` e as páginas intactas.

## Estrutura

```
index.html, main.jsx, App.jsx    # shell, rotas (hash) e navegação
src/engine.js                    # meta individual, índice, coerência, alertas, indicadores da rede
src/store.js                     # estado, persistência local, ações
src/demo.js                      # dados de demonstração + checklists (documentos 1 e 6)
src/pages/*.jsx                  # uma página por módulo
src/ui/common.jsx, src/styles.css
clube-google-primeira-pagina/    # PDF do projeto e fontes para regenerá-lo
secreto/                         # PWA estática independente (não faz parte deste app)
```
