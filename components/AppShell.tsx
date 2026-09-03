'use client'

import type { ReactNode } from 'react'
import { useFlows } from './FlowsProvider'

/**
 * Enquanto um fluxo modal está aberto, o restante da página fica inerte:
 * leitores de tela e navegação por teclado param na caixa de diálogo.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { flow } = useFlows()
  return <div inert={flow !== null}>{children}</div>
}
