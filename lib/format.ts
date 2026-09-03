/** Máscara progressiva de telefone brasileiro: (11) 99999-9999 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, '($1')
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d{0,4})/, '($1) $2')
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}

/** Aceita fixo (10) e celular (11) dígitos com DDD válido. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 10 && digits.length !== 11) return false
  if (Number(digits.slice(0, 2)) < 11) return false
  if (digits.length === 11 && digits[2] !== '9') return false
  return true
}

/** Converte um telefone digitado em E.164 brasileiro. */
export function toInternational(value: string): string {
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('55') ? digits : `55${digits}`
}

export function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  if (!digits) return ''
  return `R$ ${Number(digits).toLocaleString('pt-BR')}`
}

export function maskKm(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 7)
  if (!digits) return ''
  return `${Number(digits).toLocaleString('pt-BR')} km`
}

export function maskYear(value: string): string {
  return value.replace(/[^\d/]/g, '').slice(0, 9)
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2
}
