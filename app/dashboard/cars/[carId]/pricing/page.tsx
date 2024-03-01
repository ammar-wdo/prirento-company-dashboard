import CarPricingsForm from '@/components/(car pricing)/car-pricings-form'
import GoBackButton from '@/components/go-back-button'
import Heading from '@/components/heading'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
  params:{carId:string}
}

const page = async({params}: Props) => {

  const company = await getCompany()

  const car = await prisma.car.findUnique({
   where:{
    id:params.carId,
    companyId:company?.id,
    
   },
   include:{
    carModel:{include:{carBrand:{select:{brand:true}}}}
   }
  })

  if(!car) notFound()
  return (
    <div>
        <div className="flex gap-2 items-center">
        <GoBackButton url='/dashboard/cars' />
        <Heading title={`${car.carModel.carBrand.brand} ${car.carModel.name}`} description='Manage pricings for each day'/>
        </div>
       


        <div className="mt-8 md:mt-12 max-w-5xl bg-white p-6 border rounded-md">
        <CarPricingsForm pricings={car.pricings} hourPrice={car.hourPrice} id={params.carId} />
      </div>
    </div>
  )
}

export default page