'use client'

import { useEffect } from 'react'
import { scrollToTop } from '@/lib/animations'

export const CaseStudyScrollReset = () => {
  useEffect(() => {
    scrollToTop()
  }, [])

  return null
}