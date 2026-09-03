'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ConsentBox, OptionGroup, TextAreaField, TextField } from '@/components/Field'
import { FormSuccess } from '@/components/FormSuccess'
import { useFlows } from '@/components/FlowsProvider'
import { track } from '@/lib/analytics'
import { mirrorLead } from '@/lib/leads'
import { isValidName, isValidPhone, maskKm, maskPhone, maskYear } from '@/lib/format'
import { tradeMessage, type TradeData } from '@/lib/whatsapp'
import { FieldGroup } from '@/components/FieldGroup'
import { BUDGETS } from './conciergeOptions'

const EMPTY: TradeData = {
  currentBrand: '', currentModel: '', currentYear: '', currentKm: '',
  targetBrand: '', targetModel: '', budget: '',
  name: '', phone: '', notes: '', consent: false,
}

type Errors = Partial<Record<keyof TradeData, string>>

export function TradeForm() {
  const { sendToWhatsapp } = useFlows()
  const [data, setData] = useState<TradeData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  const set = <K extends keyof TradeData>(key: K, value: TradeData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const submit = () => {
    const found: Errors = {}
    if (!data.currentBrand.trim()) found.currentBrand = 'Informe a marca.'
    if (!data.currentModel.trim()) found.currentModel = 'Informe o modelo.'
    if (!data.budget) found.budget = 'Selecione uma faixa.'
    if (!isValidName(data.name)) found.name = 'Informe seu nome.'
    if (!isValidPhone(data.phone)) found.phone = 'Informe um WhatsApp válido com DDD.'
    if (!data.consent) found.consent = 'Precisamos da sua autorização para entrar em contato.'

    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    track('trade_car_completed')
    mirrorLead('trade', data as unknown as Record<string, unknown>)
    setDone(true)
  }

  if (done) {
    return (
      <FormSuccess
        title="Simulação registrada."
        description="Com esses dados um consultor consegue calcular a diferença e apresentar opções."
        onContinue={() => sendToWhatsapp(tradeMessage(data), 'click_whatsapp', { origin: 'trade' })}
      />
    )
  }

  return (
    <div className="grid gap-10">
      <FieldGroup index="01" title="Veículo atual">
        <TextField label="Marca" value={data.currentBrand} error={errors.currentBrand} autoComplete="off" onChange={(e) => set('currentBrand', e.target.value)} />
        <TextField label="Modelo" value={data.currentModel} error={errors.currentModel} autoComplete="off" onChange={(e) => set('currentModel', e.target.value)} />
        <TextField label="Ano" inputMode="numeric" optional value={data.currentYear} onChange={(e) => set('currentYear', maskYear(e.target.value))} />
        <TextField label="Quilometragem" inputMode="numeric" optional value={data.currentKm} onChange={(e) => set('currentKm', maskKm(e.target.value))} />
      </FieldGroup>

      <FieldGroup index="02" title="Veículo de interesse">
        <TextField label="Marca" optional value={data.targetBrand} autoComplete="off" onChange={(e) => set('targetBrand', e.target.value)} />
        <TextField label="Modelo" optional value={data.targetModel} autoComplete="off" onChange={(e) => set('targetModel', e.target.value)} />
      </FieldGroup>

      <div>
        <div className="flex items-center gap-3">
          <span className="label-gold tabular-nums">03</span>
          <span className="h-px w-5 bg-gold/40" aria-hidden />
          <span className="label">Diferença considerada</span>
        </div>
        <div className="mt-6">
          <OptionGroup
            name="tradeBudget"
            legend="Faixa de investimento adicional"
            options={BUDGETS}
            value={data.budget}
            onChange={(v) => set('budget', v)}
            error={errors.budget}
            columns={2}
          />
        </div>
      </div>

      <FieldGroup index="04" title="Seus dados">
        <TextField label="Nome" value={data.name} error={errors.name} autoComplete="name" onChange={(e) => set('name', e.target.value)} />
        <TextField label="WhatsApp" inputMode="tel" placeholder="(11) 99999-9999" autoComplete="tel" value={data.phone} error={errors.phone} onChange={(e) => set('phone', maskPhone(e.target.value))} />
        <div className="sm:col-span-2">
          <TextAreaField label="Observações" optional rows={3} value={data.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <ConsentBox checked={data.consent} onChange={(v) => set('consent', v)} error={errors.consent} id="trade-consent" />
        </div>
      </FieldGroup>

      <button type="button" onClick={submit} className="btn btn-primary w-full">
        Simular troca
        <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  )
}
