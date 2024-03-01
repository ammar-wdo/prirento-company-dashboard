import CarAvailabilityForm from '@/components/(car availability)/car-availability-form'
import GoBackButton from '@/components/go-back-button'
import Heading from '@/components/heading'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
    params:{carId:string,availabilityId:string}
}

const page = async({params}: Props) => {
   const company = await getCompany()
   const carRes =  prisma.car.findUnique({
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
   
   const availabilityRes =  prisma.carAvailability.findUnique({
    where:{
        id:params.availabilityId,
        carId:params.carId,
        car:{
            companyId:company?.id
        }
    }
   })

   const [car,availability] = await Promise.all([carRes,availabilityRes])

   if(!car || (!availability && params.availabilityId !=='new')) notFound()

  return (
    <div>
        <div className="flex items-center gap-2">
        <GoBackButton url='/dashboard/cars'/>
        <Heading title={car ? `${car.carModel.carBrand.brand} ${car.carModel.name} - Availability` : 'Availability'} description='Manage your car availability' />
        </div>
  
        <div className='max-w-5xl mt-12 p-6 border rounded-md bg-white'>
            <CarAvailabilityForm carAvailability={availability}/>
        </div>
    </div>
  )
}

export default page