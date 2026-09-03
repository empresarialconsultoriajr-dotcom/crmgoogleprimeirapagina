'use client'

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

type Base = {
  label: string
  hint?: string
  error?: string
  optional?: boolean
}

function Shell({
  label,
  hint,
  error,
  optional,
  id,
  children,
}: Base & { id: string; children: ReactNode }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="label block">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-bone/50">opcional</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[12px] text-[#e07a5f]">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-[12px] text-bone/50">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function TextField({
  label,
  hint,
  error,
  optional,
  ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId()
  const id = props.id ?? auto
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} id={id}>
      <input
        {...props}
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
    </Shell>
  )
}

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  ...props
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId()
  const id = props.id ?? auto
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} id={id}>
      <textarea
        {...props}
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
    </Shell>
  )
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  options,
  placeholder,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: string[]; placeholder?: string }) {
  const auto = useId()
  const id = props.id ?? auto
  return (
    <Shell label={label} hint={hint} error={error} optional={optional} id={id}>
      <select
        {...props}
        id={id}
        className="field"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </Shell>
  )
}

type OptionGroupProps = {
  legend: string
  options: readonly string[]
  value: string
  onChange: (value: string) => void
  columns?: 1 | 2
  /** Duas colunas já no celular — para rótulos curtos, corta metade da rolagem. */
  dense?: boolean
  error?: string
  name: string
  /** Rótulo visível acima do grupo. Sem ele, a legend fica só para leitores de tela. */
  label?: string
}

/**
 * Grupo de escolha em formato de lista editorial.
 * Radiogroup real: navegável por teclado e anunciado por leitores de tela.
 */
export function OptionGroup({
  legend,
  options,
  value,
  onChange,
  columns = 1,
  dense = false,
  error,
  name,
  label,
}: OptionGroupProps) {
  const id = useId()
  const grid = columns === 2 ? (dense ? 'grid-cols-2' : 'sm:grid-cols-2') : ''

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      {label ? <legend className="label mb-3.5">{label}</legend> : <legend className="sr-only">{legend}</legend>}
      <div className={`grid gap-2.5 ${grid}`}>
        {options.map((option) => {
          const selected = value === option
          return (
            <label key={option} className="option cursor-pointer" data-selected={selected}>
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`pointer-events-none h-[5px] w-[5px] shrink-0 rounded-full transition-colors duration-500 ${
                  selected ? 'bg-gold' : 'bg-bone/20'
                }`}
              />
              <span className="text-[14px] leading-snug md:text-[15px]">{option}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-[12px] text-[#e07a5f]">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function ConsentBox({
  checked,
  onChange,
  error,
  id = 'consent',
  label = 'Autorizo o contato da HS CAR’S por WhatsApp sobre veículos compatíveis com meu interesse.',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  error?: string
  id?: string
  label?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3.5">
        <span className="relative mt-[2px] flex h-[18px] w-[18px] shrink-0 items-center justify-center border border-bone/25 transition-colors duration-400">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={error ? true : undefined}
          />
          <svg
            viewBox="0 0 12 10"
            aria-hidden
            className={`pointer-events-none h-[10px] w-[12px] transition-opacity duration-300 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <path d="M1 5.2 4.3 8.5 11 1.5" fill="none" stroke="#CFA060" strokeWidth="1.6" />
          </svg>
        </span>
        <span className="text-[13px] leading-relaxed text-bone/60">{label}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 pl-[30px] text-[12px] text-[#e07a5f]">
          {error}
        </p>
      )}
    </div>
  )
}
