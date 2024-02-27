import BookingFeed from '@/components/(booking)/booking-feed'
import Heading from '@/components/heading'
import React from 'react'

type Props = {}
export const revalidate = 0

const page = (props: Props) => {
  return (
    <div>
      <Heading title='Bookings' description='Manage your bookings'/>
      <div className='mt-12  rounded-xl bg-white'>
        <BookingFeed/>
      </div>
    </div>
  )
}

export default page