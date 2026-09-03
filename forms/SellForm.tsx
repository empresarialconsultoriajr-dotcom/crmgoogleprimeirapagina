'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { ConsentBox, OptionGroup, TextAreaField, TextField } from '@/components/Field'
import { FormSuccess } from '@/components/FormSuccess'
import { useFlows } from '@/components/FlowsProvider'
import { track } from '@/lib/analytics'
import { mirrorLead } from '@/lib/leads'
import { isValidName, isValidPhone, maskCurrency, maskKm, maskPhone, maskYear } from '@/lib/format'
import { sellMessage, type SellData } from '@/lib/whatsapp'
import { FieldGroup } from '@/components/FieldGroup'
import { YES_NO } from './conciergeOptions'

const EMPTY: SellData = {
  name: '', phone: '', brand: '', model: '', year: '', version: '',
  km: '', color: '', price: '', financed: '', notes: '', consent: false,
}

type Errors = Partial<Record<keyof SellData, string>>

export function SellForm() {
  const { sendToWhatsapp } = useFlows()
  const [data, setData] = useState<SellData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  const set = <K extends keyof SellData>(key: K, value: SellData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const submit = () => {
    const found: Errors = {}
    if (!isValidName(data.name)) found.name = 'Informe seu nome.'
    if (!isValidPhone(data.phone)) found.phone = 'Informe um WhatsApp válido com DDD.'
    if (!data.brand.trim()) found.brand = 'Informe a marca.'
    if (!data.model.trim()) found.model = 'Informe o modelo.'
    if (!data.year.trim()) found.year = 'Informe o ano.'
    if (!data.consent) found.consent = 'Precisamos da sua autorização para entrar em contato.'

    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    track('sell_car_completed')
    mirrorLead('sell', data as unknown as Record<string, unknown>)
    setDone(true)
  }

  if (done) {
    return (
      <FormSuccess
        title="Veículo recebido."
        description="Nossa equipe já pode iniciar a avaliação. Envie os dados para um consultor."
        onContinue={() => sendToWhatsapp(sellMessage(data), 'click_whatsapp', { origin: 'sell' })}
      />
    )
  }

  return (
    <div className="grid gap-10">
      <FieldGroup index="01" title="Seus dados">
        <TextField label="Nome" value={data.name} error={errors.name} autoComplete="name" onChange={(e) => set('name', e.target.value)} />
        <TextField label="WhatsApp" inputMode="tel" placeholder="(11) 99999-9999" autoComplete="tel" value={data.phone} error={errors.phone} onChange={(e) => set('phone', maskPhone(e.target.value))} />
      </FieldGroup>

      <FieldGroup index="02" title="O veículo">
        <TextField label="Marca" value={data.brand} error={errors.brand} autoComplete="off" onChange={(e) => set('brand', e.target.value)} />
        <TextField label="Modelo" value={data.model} error={errors.model} autoComplete="off" onChange={(e) => set('model', e.target.value)} />
        <TextField label="Ano" inputMode="numeric" value={data.year} error={errors.year} onChange={(e) => set('year', maskYear(e.target.value))} />
        <TextField label="Versão" optional value={data.version} autoComplete="off" onChange={(e) => set('version', e.target.value)} />
        <TextField label="Quilometragem" inputMode="numeric" optional value={data.km} onChange={(e) => set('km', maskKm(e.target.value))} />
        <TextField label="Cor" optional value={data.color} autoComplete="off" onChange={(e) => set('color', e.target.value)} />
      </FieldGroup>

      <FieldGroup index="03" title="Condições">
        <TextField label="Valor esperado" inputMode="numeric" optional value={data.price} onChange={(e) => set('price', maskCurrency(e.target.value))} />
        <div className="sm:col-span-2">
          <span className="label mb-3 block">Possui financiamento?</span>
          <OptionGroup
            name="financed"
            legend="Possui financiamento"
            options={YES_NO}
            value={data.financed === 'sim' ? 'Sim' : data.financed === 'nao' ? 'Não' : ''}
            onChange={(v) => set('financed', v === 'Sim' ? 'sim' : 'nao')}
            columns={2}
          />
        </div>
        <div className="sm:col-span-2">
          <TextAreaField label="Observações" optional rows={3} value={data.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
      </FieldGroup>

      <ConsentBox checked={data.consent} onChange={(v) => set('consent', v)} error={errors.consent} id="sell-consent" />

      <button type="button" onClick={submit} className="btn btn-primary w-full">
        Solicitar avaliação
        <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  )
}
