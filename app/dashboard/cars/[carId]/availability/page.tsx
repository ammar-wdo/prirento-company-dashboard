import CarAvailabilityFeed from '@/components/(car availability)/car-availability-feed'
import Heading from '@/components/heading'
import NavigatorButton from '@/components/navigator-button'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { notFound } from 'next/navigation'
import React from 'react'

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
      <div className='flex items-center justify-between'>
      <Heading title={car ? `${car.carModel.carBrand.brand} ${car.carModel.name} - Availability` : 'Availability'} description='Manage your car availability' />
      <NavigatorButton href={`/dashboard/cars/${params.carId}/availability/new`} >Add new date </NavigatorButton>
      </div>
      <div className='mt-12'>
        <CarAvailabilityFeed carId={params.carId} />
      </div>
       
    </div>
  )
}

export default page