import React, { ReactNode } from 'react'

type Props = {
    children:ReactNode
    title:string
}

const BookingCard = ({children,title}: Props) => {
  return (
    <article className='p-4 rounded-xl bg-white w-full'>
    <h3 className='font-semibold capitalize text-xl '>{title}</h3>
    <div className='mt-2'>
        {children}
    </div>
                </article>
  )
}

export default BookingCard