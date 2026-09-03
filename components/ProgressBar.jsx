import React from 'react'
import { useScrollProgress } from '../lib/useReveal.js'

/** Fio de progresso: a travessia das redes para além delas, medida em luz. */
export default function ProgressBar() {
  const progress = useScrollProgress()
  return (
    <div className="progress" aria-hidden="true">
      <div className="progress__bar" style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
