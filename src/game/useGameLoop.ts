import { useEffect, useRef } from 'react'

export function useGameLoop(callback: () => void, active: boolean, fps = 10) {
  const cbRef = useRef(callback)
  cbRef.current = callback

  useEffect(() => {
    if (!active) return
    let last = 0
    let rafId: number
    const interval = 1000 / fps

    function loop(now: number) {
      rafId = requestAnimationFrame(loop)
      if (now - last >= interval) {
        last = now
        cbRef.current()
      }
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [active, fps])
}
