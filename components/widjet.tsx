import React, { ReactNode } from 'react'

type Props = {
    title:string;
    children:ReactNode
}

const Widjet = ({title,children}: Props) => {
  return (
    <div className='p-4 border rounded-xl min-h-[150px] bg-white flex flex-col justify-between'>
        <p className='px-4 py-2 rounded-xl bg-secondaryGreen text-white w-fit capitalize'>{title}</p>
<div>{children}</div>
    </div>
  )
}

export default Widjet