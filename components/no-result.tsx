import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    title?:string,
    className?:string
}

const NoResult = ({title,className}: Props) => {
  return (
    <p className={cn('text-2xl font-semibold capitalize text-center text-muted-foreground',className)}>{title ? title : "No result"}</p>
  )
}

export default NoResult