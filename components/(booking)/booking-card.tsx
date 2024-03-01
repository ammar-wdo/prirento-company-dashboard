import React, { ReactNode } from 'react'

type Props = {
    children:ReactNode
    title:string
}

const BookingCard = ({children,title}: Props) => {
  return (
    <article className='rounded-xl bg-white w-full overflow-hidden'>
    <h3 className='p-4  font-semibold capitalize text-xl bg-secondaryGreen text-white'>{title}</h3>
    <div className='p-4  mt-2'>
        {children}
    </div>
                </article>
  )
}

export default BookingCard