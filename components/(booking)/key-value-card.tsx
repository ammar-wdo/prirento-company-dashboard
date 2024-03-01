import React from 'react'

type Props = {
    title:string,
    description:string
}

const KeyValueCard = ({title,description}: Props) => {
  return (
    <div className='flex items-center justify-between gap-12 p-3 rounded-md hover:bg-muted transition'>
        <span className='text-muted-foreground text-sm capitalize'>{title}</span>
        <span className='text-sm font-medium capitalize'>{description}</span>
    </div>
  )
}

export default KeyValueCard