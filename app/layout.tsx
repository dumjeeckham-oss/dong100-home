'use client'

import React from 'react'
import { VisualEditing } from '@sanity/visual-editing/next'

interface Props {
  children: React.ReactNode
}

export default function RootLayout({ children }: Props) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'xczp11sl'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production'

  return (
    <VisualEditing projectId={projectId} dataset={dataset}>
      {children}
    </VisualEditing>
  )
}
