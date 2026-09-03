import { siteConfig, isWhatsappConfigured } from '@/config/siteConfig'

/**
 * Monta a URL do WhatsApp. Retorna null quando o número ainda não foi
 * configurado — a UI então oferece um caminho alternativo em vez de
 * levar o usuário a um link quebrado.
 */
export function buildWhatsappUrl(message: string): string | null {
  if (!isWhatsappConfigured) return null
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`
}

/** Uma linha "Rótulo: valor" — descartada quando o campo veio vazio. */
const line = (label: string, value?: string): string | null => {
  const v = value?.trim()
  return v ? `${label}: ${v}` : null
}

/** Um bloco titulado. Some por inteiro se nenhuma linha sobreviver. */
const block = (title: string, lines: (string | null)[]): string | null => {
  const kept = lines.filter((l): l is string => Boolean(l && l.trim()))
  return kept.length > 0 ? [title, ...kept].join('\n') : null
}

/** Junta os blocos existentes com exatamente uma linha em branco entre eles. */
const compose = (parts: (string | null)[]): string =>
  parts.filter((part): part is string => Boolean(part && part.trim())).join('\n\n')

const yesNo = (v: 'sim' | 'nao' | ''): string | undefined =>
  v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : undefined

export type ConciergeData = {
  brand: string
  model: string
  year: string
  color: string
  budget: string
  payment: string
  hasTrade: 'sim' | 'nao' | ''
  tradeBrand: string
  tradeModel: string
  tradeYear: string
  tradeKm: string
  tradeValue: string
  timeframe: string
  name: string
  phone: string
  notes: string
  consent: boolean
}

export function conciergeMessage(d: ConciergeData): string {
  const trade =
    d.hasTrade === 'sim'
      ? block('VEÍCULO PARA TROCA', [
          'Sim',
          line('Marca', d.tradeBrand),
          line('Modelo', d.tradeModel),
          line('Ano', d.tradeYear),
          line('KM', d.tradeKm),
          line('Valor esperado', d.tradeValue),
        ])
      : block('VEÍCULO PARA TROCA', ['Não'])

  return compose([
    `Olá, equipe ${siteConfig.brandName}.`,
    `Vim pelo Instagram e utilizei o Concierge ${siteConfig.brandName} para encontrar um veículo.`,
    block('DADOS', [line('Nome', d.name), line('WhatsApp', d.phone)]),
    block('VEÍCULO PROCURADO', [
      line('Marca', d.brand),
      line('Modelo', d.model),
      line('Ano', d.year),
      line('Cor', d.color),
    ]),
    block('INVESTIMENTO', [line('Faixa', d.budget)]),
    block('FORMA DE COMPRA', [d.payment]),
    trade,
    block('PRAZO', [d.timeframe]),
    block('OBSERVAÇÕES', [d.notes]),
    'Gostaria de receber algumas opções compatíveis.',
  ])
}

export type SellData = {
  name: string
  phone: string
  brand: string
  model: string
  year: string
  version: string
  km: string
  color: string
  price: string
  financed: 'sim' | 'nao' | ''
  notes: string
  consent: boolean
}

export function sellMessage(d: SellData): string {
  return compose([
    `Olá, equipe ${siteConfig.brandName}.`,
    'Vim pelo site e gostaria de apresentar meu veículo para avaliação.',
    block('DADOS', [line('Nome', d.name), line('WhatsApp', d.phone)]),
    block('VEÍCULO', [
      line('Marca', d.brand),
      line('Modelo', d.model),
      line('Ano', d.year),
      line('Versão', d.version),
      line('KM', d.km),
      line('Cor', d.color),
      line('Valor esperado', d.price),
      line('Possui financiamento', yesNo(d.financed)),
    ]),
    block('OBSERVAÇÕES', [d.notes]),
    'Gostaria de receber uma avaliação.',
  ])
}

export type TradeData = {
  currentBrand: string
  currentModel: string
  currentYear: string
  currentKm: string
  targetBrand: string
  targetModel: string
  budget: string
  name: string
  phone: string
  notes: string
  consent: boolean
}

export function tradeMessage(d: TradeData): string {
  return compose([
    `Olá, equipe ${siteConfig.brandName}.`,
    'Vim pelo site e gostaria de simular uma troca.',
    block('DADOS', [line('Nome', d.name), line('WhatsApp', d.phone)]),
    block('VEÍCULO ATUAL', [
      line('Marca', d.currentBrand),
      line('Modelo', d.currentModel),
      line('Ano', d.currentYear),
      line('KM', d.currentKm),
    ]),
    block('VEÍCULO DE INTERESSE', [line('Marca', d.targetBrand), line('Modelo', d.targetModel)]),
    block('DIFERENÇA CONSIDERADA', [d.budget]),
    block('OBSERVAÇÕES', [d.notes]),
    'Gostaria de entender as condições.',
  ])
}

export const consultantMessage = (): string =>
  `Olá, equipe ${siteConfig.brandName}. Vim pelo site e gostaria de falar com um consultor.`
