'use client'

import { useCallback, useEffect, useRef, useState } from "react"

const DWELL_MS = 2000

export function useProjectCardHover() {
  const [hovered, setHovered] = useState(false)
  const [intent, setIntent] = useState(false)
  const timer = useRef<number | null>(null)
  const canHoverRef = useRef(false)

  const clear = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  const onEnter = useCallback(() => {
    if (!canHoverRef.current) return

    setHovered(true)
    clear()

    timer.current = window.setTimeout(() => {
      setIntent(true)
    }, DWELL_MS)
  }, [clear])

  const onLeave = useCallback(() => {
    setHovered(false)
    setIntent(false)
    clear()
  }, [clear])

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)')

    const updateCanHover = () => {
      const canHover = media.matches
      canHoverRef.current = canHover

      if (!canHover) {
        setHovered(false)
        setIntent(false)
        clear()
      }
    }

    updateCanHover()

    media.addEventListener('change', updateCanHover)
    return () => media.removeEventListener('change', updateCanHover)
  }, [clear])

  useEffect(() => {
    return clear
  }, [clear])

  return { hovered, intent, onEnter, onLeave }
}