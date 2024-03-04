import CarAvailabilityFeed from '@/components/(car availability)/car-availability-feed'
import FullCalendarComponent from '@/components/(car)/car-full-calendar'
import FullCalendarServerWrapper from '@/components/(car)/full-calendar-server-wrapper'
import GoBackButton from '@/components/go-back-button'
import Heading from '@/components/heading'
import NavigatorButton from '@/components/navigator-button'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

type Props = {
  params:{carId:string}
}

const page = async({params}: Props) => {

  const company = await getCompany()
   const car = await  prisma.car.findUnique({
    where:{
        id:params.carId,
        companyId:company?.id
    },include:{
        carModel:{
            include:{
                carBrand:{select:{brand:true}}
            }
        }
    }
   })

   if(!car) notFound()
   
  return (
    <div>
     
  
      <div className='flex md:justify-between md:flex-row flex-col gap-8 w-full'>
        <div className='flex items-center gap-2'>
        <GoBackButton url='/dashboard/cars'/>
        <Heading title={car ? `${car.carModel.carBrand.brand} ${car.carModel.name} - Availability` : 'Availability'} description='Manage your car availability' />
        </div>

 
      <NavigatorButton href={`/dashboard/cars/${params.carId}/availability/new`} ><Plus className='mr-2 h-3 w-3' /> Add new date </NavigatorButton>
   

    
      </div>
      <div className='mt-12'>
        <Suspense fallback={<Skeleton className='min-h-[700px]'/>}>
        <CarAvailabilityFeed carId={params.carId} />
        </Suspense>

      </div>
      <div className='mt-20 overflow-x-auto bg-white p-4 rounded-xl'>
        <Suspense fallback={<Skeleton className='min-h-[700px] '/>}>
        <FullCalendarServerWrapper carId={params.carId}/>
        </Suspense>

      </div>
       
    </div>
  )
}

export default page