'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ConsentBox, OptionGroup, TextAreaField, TextField } from '@/components/Field'
import { FormSuccess } from '@/components/FormSuccess'
import { useFlows } from '@/components/FlowsProvider'
import { stepEvent, track } from '@/lib/analytics'
import { mirrorLead } from '@/lib/leads'
import { isValidName, isValidPhone, maskCurrency, maskKm, maskPhone, maskYear } from '@/lib/format'
import { conciergeMessage, type ConciergeData } from '@/lib/whatsapp'
import { editorialTransition } from '@/lib/motion'
import { BUDGETS, PAYMENTS, TIMEFRAMES, UNDECIDED, YES_NO } from './conciergeOptions'

const TOTAL = 6

const EMPTY: ConciergeData = {
  brand: '', model: '', year: '', color: '',
  budget: '', payment: '',
  hasTrade: '', tradeBrand: '', tradeModel: '', tradeYear: '', tradeKm: '', tradeValue: '',
  timeframe: '',
  name: '', phone: '', notes: '', consent: false,
}

type Errors = Partial<Record<keyof ConciergeData | 'step', string>>

const QUESTIONS = [
  'Qual veículo você procura?',
  'Qual faixa de investimento você considera?',
  'Como pretende realizar a compra?',
  'Possui veículo para troca?',
  'Quando pretende comprar?',
  'Estamos quase lá.',
] as const

export function ConciergeForm() {
  const { sendToWhatsapp } = useFlows()
  const reduced = useReducedMotion() ?? false

  const [step, setStep] = useState(1)
  const [data, setData] = useState<ConciergeData>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const [undecided, setUndecided] = useState(false)
  const started = useRef(false)
  const headingRef = useRef<HTMLParagraphElement>(null)

  const set = useCallback(
    <K extends keyof ConciergeData>(key: K, value: ConciergeData[K]) => {
      if (!started.current) {
        started.current = true
        track('start_car_finder')
        track(stepEvent(1))
      }
      setData((prev) => ({ ...prev, [key]: value }))
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    },
    [],
  )

  const validate = useCallback(
    (target: number): Errors => {
      const next: Errors = {}
      if (target === 1 && !undecided && !data.brand.trim() && !data.model.trim()) {
        next.brand = 'Informe ao menos a marca ou o modelo — ou marque “Ainda não decidi”.'
      }
      if (target === 2 && !data.budget) next.budget = 'Selecione uma faixa para seguir.'
      if (target === 3 && !data.payment) next.payment = 'Selecione uma forma de compra.'
      if (target === 4) {
        if (!data.hasTrade) next.hasTrade = 'Selecione uma opção.'
        else if (data.hasTrade === 'sim') {
          if (!data.tradeBrand.trim()) next.tradeBrand = 'Informe a marca.'
          if (!data.tradeModel.trim()) next.tradeModel = 'Informe o modelo.'
        }
      }
      if (target === 5 && !data.timeframe) next.timeframe = 'Selecione um prazo.'
      if (target === 6) {
        if (!isValidName(data.name)) next.name = 'Informe seu nome.'
        if (!isValidPhone(data.phone)) next.phone = 'Informe um WhatsApp válido com DDD.'
        if (!data.consent) next.consent = 'Precisamos da sua autorização para entrar em contato.'
      }
      return next
    },
    [data, undecided],
  )

  const focusHeading = () =>
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }))

  const goNext = () => {
    const found = validate(step)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    const next = step + 1
    setStep(next)
    track(stepEvent(next))
    focusHeading()
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => Math.max(1, s - 1))
    focusHeading()
  }

  const payload = useMemo<ConciergeData>(
    () => ({
      ...data,
      brand: undecided ? UNDECIDED : data.brand,
      model: undecided ? '' : data.model,
      year: undecided ? '' : data.year,
      color: undecided ? '' : data.color,
    }),
    [data, undecided],
  )

  const submit = () => {
    const found = validate(6)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    track('car_finder_completed', { budget: payload.budget, timeframe: payload.timeframe })
    mirrorLead('concierge', payload as unknown as Record<string, unknown>)
    setDone(true)
  }

  const handoff = () => sendToWhatsapp(conciergeMessage(payload), 'click_whatsapp', { origin: 'concierge' })

  if (done) return <FormSuccess onContinue={handoff} />

  const slide = {
    initial: { opacity: 0, x: 18 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -14 },
    transition: editorialTransition(reduced, 0.45),
  }

  return (
    <div>
      {/* Progresso — discreto, tipográfico, sem barra de app. */}
      <div className="flex items-end justify-between gap-6">
        <span className="label tabular-nums text-bone/60">
          <span className="text-gold">{String(step).padStart(2, '0')}</span> — {String(TOTAL).padStart(2, '0')}
        </span>
        <span className="label hidden sm:inline">Concierge</span>
      </div>

      <div
        className="mt-3 h-px w-full bg-bone/8"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL}
        aria-valuenow={step}
        aria-label={`Etapa ${step} de ${TOTAL}`}
      >
        <motion.div
          className="h-px bg-gold"
          initial={false}
          animate={{ width: `${(step / TOTAL) * 100}%` }}
          transition={editorialTransition(reduced, 0.7)}
        />
      </div>

      <p
        ref={headingRef}
        tabIndex={-1}
        className="display mt-9 text-[clamp(1.35rem,5.2vw,1.9rem)] focus:outline-none"
        aria-live="polite"
      >
        {QUESTIONS[step - 1]}
      </p>

      <div className="mt-8 min-h-[292px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} {...slide}>
            {step === 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                <TextField
                  label="Marca"
                  placeholder="Ex.: Toyota"
                  value={undecided ? '' : data.brand}
                  disabled={undecided}
                  error={errors.brand}
                  autoComplete="off"
                  onChange={(e) => set('brand', e.target.value)}
                />
                <TextField
                  label="Modelo"
                  placeholder="Ex.: Corolla"
                  value={undecided ? '' : data.model}
                  disabled={undecided}
                  autoComplete="off"
                  onChange={(e) => set('model', e.target.value)}
                />
                <TextField
                  label="Ano"
                  placeholder="Ex.: 2022"
                  inputMode="numeric"
                  value={undecided ? '' : data.year}
                  disabled={undecided}
                  optional
                  onChange={(e) => set('year', maskYear(e.target.value))}
                />
                <TextField
                  label="Preferência de cor"
                  placeholder="Ex.: Preto"
                  value={undecided ? '' : data.color}
                  disabled={undecided}
                  optional
                  autoComplete="off"
                  onChange={(e) => set('color', e.target.value)}
                />
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    aria-pressed={undecided}
                    onClick={() => {
                      setUndecided((v) => !v)
                      setErrors({})
                    }}
                    className="option cursor-pointer"
                    data-selected={undecided}
                  >
                    <span
                      aria-hidden
                      className={`h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-500 ${
                        undecided ? 'bg-gold' : 'bg-bone/20'
                      }`}
                    />
                    <span className="text-[14px] md:text-[15px]">
                      {UNDECIDED} — quero a curadoria da equipe
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <OptionGroup
                name="budget"
                legend="Faixa de investimento"
                options={BUDGETS}
                value={data.budget}
                onChange={(v) => set('budget', v)}
                error={errors.budget}
                columns={2}
              />
            )}

            {step === 3 && (
              <OptionGroup
                name="payment"
                legend="Forma de compra"
                options={PAYMENTS}
                value={data.payment}
                onChange={(v) => set('payment', v)}
                error={errors.payment}
                columns={2}
              />
            )}

            {step === 4 && (
              <div>
                <OptionGroup
                  name="hasTrade"
                  legend="Possui veículo para troca"
                  options={YES_NO}
                  value={data.hasTrade === 'sim' ? 'Sim' : data.hasTrade === 'nao' ? 'Não' : ''}
                  onChange={(v) => set('hasTrade', v === 'Sim' ? 'sim' : 'nao')}
                  error={errors.hasTrade}
                  columns={2}
                />

                <AnimatePresence initial={false}>
                  {data.hasTrade === 'sim' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={editorialTransition(reduced, 0.5)}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pt-8 sm:grid-cols-2">
                        <TextField
                          label="Marca do seu veículo"
                          value={data.tradeBrand}
                          error={errors.tradeBrand}
                          autoComplete="off"
                          onChange={(e) => set('tradeBrand', e.target.value)}
                        />
                        <TextField
                          label="Modelo"
                          value={data.tradeModel}
                          error={errors.tradeModel}
                          autoComplete="off"
                          onChange={(e) => set('tradeModel', e.target.value)}
                        />
                        <TextField
                          label="Ano"
                          inputMode="numeric"
                          value={data.tradeYear}
                          onChange={(e) => set('tradeYear', maskYear(e.target.value))}
                        />
                        <TextField
                          label="Quilometragem"
                          inputMode="numeric"
                          value={data.tradeKm}
                          onChange={(e) => set('tradeKm', maskKm(e.target.value))}
                        />
                        <div className="sm:col-span-2">
                          <TextField
                            label="Valor aproximado esperado"
                            inputMode="numeric"
                            optional
                            value={data.tradeValue}
                            onChange={(e) => set('tradeValue', maskCurrency(e.target.value))}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 5 && (
              <OptionGroup
                name="timeframe"
                legend="Prazo de compra"
                options={TIMEFRAMES}
                value={data.timeframe}
                onChange={(v) => set('timeframe', v)}
                error={errors.timeframe}
                columns={2}
              />
            )}

            {step === 6 && (
              <div className="grid gap-6">
                <TextField
                  label="Nome"
                  value={data.name}
                  error={errors.name}
                  autoComplete="name"
                  onChange={(e) => set('name', e.target.value)}
                />
                <TextField
                  label="WhatsApp"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={data.phone}
                  error={errors.phone}
                  autoComplete="tel"
                  onChange={(e) => set('phone', maskPhone(e.target.value))}
                />
                <TextAreaField
                  label="Observação"
                  optional
                  rows={3}
                  placeholder="Algo que a equipe precisa saber?"
                  value={data.notes}
                  onChange={(e) => set('notes', e.target.value)}
                />
                <ConsentBox
                  checked={data.consent}
                  onChange={(v) => set('consent', v)}
                  error={errors.consent}
                  id="concierge-consent"
                />
                <p className="text-[12px] leading-relaxed text-bone/50">
                  Usamos seus dados apenas para apresentar veículos compatíveis com o seu interesse. Você pode
                  solicitar a exclusão a qualquer momento.{' '}
                  <a href="/privacidade" className="text-bone/60 underline underline-offset-4 hover:text-gold">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-bone/8 pt-8 sm:flex-row-reverse sm:items-center sm:justify-between">
        {step < TOTAL ? (
          <button type="button" onClick={goNext} className="btn btn-primary w-full sm:w-auto">
            Continuar
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </button>
        ) : (
          <button type="button" onClick={submit} className="btn btn-primary w-full sm:w-auto">
            Enviar para um consultor
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </button>
        )}

        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            className="btn btn-ghost w-full border-transparent px-0 text-bone/60 hover:border-transparent hover:text-bone sm:w-auto"
          >
            <ArrowLeft size={15} strokeWidth={1.5} aria-hidden />
            Voltar
          </button>
        )}
      </div>
    </div>
  )
}
