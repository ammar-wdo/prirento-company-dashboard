import BookingFeed from '@/components/(booking)/booking-feed'
import FilterComponent from '@/components/filter-component'
import Heading from '@/components/heading'
import { Skeleton } from '@/components/ui/skeleton'
import React, { Suspense } from 'react'

type Props = {
  searchParams:{bookingCode:string | undefined,page:string | undefined}
}
export const revalidate = 0

const page = ({searchParams}: Props) => {
  return (
    <div>
      <Heading title='Bookings' description='Manage your bookings'/>

      <div className='mt-12  rounded-xl '>
        <div className='mb-3 w-fit'>
          <FilterComponent/>
        </div>
        <div className='bg-white'>
        <Suspense key={searchParams.bookingCode} fallback={<Skeleton className="min-h-[600px] bg-muted-foreground"/>}>
          <BookingFeed bookingCode={searchParams.bookingCode} page={searchParams.page} />
          </Suspense>
        </div>

      
     
      </div>
    </div>
  )
}

export default page