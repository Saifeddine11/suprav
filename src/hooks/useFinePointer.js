import { useEffect, useState } from 'react'

/** Desktop avec souris — pas de preview vidéo au survol sur mobile. */
export default function useFinePointer() {
  const [finePointer, setFinePointer] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFinePointer(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return finePointer
}
