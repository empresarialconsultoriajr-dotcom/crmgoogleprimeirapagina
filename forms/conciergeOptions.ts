export const BUDGETS = [
  'Até R$ 50 mil',
  'R$ 50 mil a R$ 80 mil',
  'R$ 80 mil a R$ 120 mil',
  'R$ 120 mil a R$ 180 mil',
  'R$ 180 mil a R$ 250 mil',
  'R$ 250 mil a R$ 400 mil',
  'Acima de R$ 400 mil',
  'Ainda estou avaliando',
] as const

export const PAYMENTS = ['À vista', 'Financiamento', 'Veículo + diferença', 'Ainda estou avaliando'] as const

export const TIMEFRAMES = [
  'Agora',
  'Próximos 7 dias',
  'Próximos 30 dias',
  'Próximos 3 meses',
  'Estou pesquisando',
] as const

export const YES_NO = ['Sim', 'Não'] as const

export const UNDECIDED = 'Ainda não decidi'

/**
 * Triagem de crédito.
 *
 * Estas perguntas só aparecem para quem escolheu financiamento. São todas
 * de toque único e por faixa — nenhum documento, nenhum número exato.
 * CPF, data de nascimento e comprovantes ficam para a conversa com o
 * consultor: são o que o banco pede, não o que a landing page deve guardar.
 */

/** Entrada é a alavanca que mais muda a aprovação. */
export const DOWN_PAYMENTS = [
  'Sem entrada',
  'Até R$ 10 mil',
  'R$ 10 a 20 mil',
  'R$ 20 a 30 mil',
  'R$ 30 a 50 mil',
  'Acima de R$ 50 mil',
] as const

/** Faixa de renda define o teto de parcela que o banco aceita. */
export const INCOMES = [
  'Até R$ 2.500',
  'R$ 2.500 a 4.000',
  'R$ 4.000 a 7.000',
  'R$ 7.000 a 12.000',
  'Acima de R$ 12.000',
] as const

/** O tipo de renda decide qual banco e quais documentos entram na ficha. */
export const INCOME_TYPES = [
  'Carteira assinada',
  'Autônomo',
  'MEI ou empresário',
  'Aposentado ou pensionista',
  'Servidor público',
  'Outro',
] as const

/** Filtro mais decisivo da pré-análise — perguntado sem julgamento. */
export const CREDIT_STATUS = ['Sem restrições', 'Com alguma restrição', 'Não tenho certeza'] as const

/** Quem já tem aprovação em mãos é o lead mais quente da fila. */
export const PREAPPROVED = ['Ainda não', 'Sim, já tenho aprovação'] as const
