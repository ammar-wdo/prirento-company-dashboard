'use client'


import { useViewportHeight } from '@/hooks/safearea-hook'
import React from 'react'

type Props = {
    children:React.ReactNode
}

const SafeareaWrapper = ({children}: Props) => {
    useViewportHeight()
  return (
    <div>{children}</div>
  )
}

export default SafeareaWrapper