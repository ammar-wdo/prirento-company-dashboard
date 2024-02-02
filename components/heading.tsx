import { cn } from '@/lib/utils'
import React from 'react'

type Props = {
    title:string,
    description:string,
    small?:boolean
}

const Heading = ({title,description,small}: Props) => {
  return (
    <div className={cn('flex flex-col gap-2',small && 'gap-0')}>
        <h3 className={cn('text-3xl font-bold capitalize',small && 'text-base ')}>{title}</h3>
        <p className={cn('text-sm font-medium text-muted-foreground capitalize',small && 'text-xs')}>{description}</p>
    </div>
  )
}

export default Heading