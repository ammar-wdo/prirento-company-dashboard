import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { notFound } from 'next/navigation'
import React from 'react'
import NoResult from '../no-result'
import CarExtraoptionCard from './carExtraOptions-card'

type Props = {
    carId:string
}

const ExtraOptionsFeed = async({carId}: Props) => {
const company = await getCompany()

const car = await prisma.car.findUnique({
    where:{
        id:carId,
        companyId:company?.id 
    }
})

const carExtraOptions = await prisma.carExtraOption.findMany({
    where:{
        carId
    }
})


if(!car) notFound()

  return (
    <div>
        {!carExtraOptions.length && <NoResult/>}
        {!!carExtraOptions.length &&  <div className="flex flex-wrap gap-3">
          {carExtraOptions.map((extraOption) => (
           <CarExtraoptionCard key={extraOption.id} extraOption={extraOption}/>
          ))}
        </div>}
    </div>
  )
}

export default ExtraOptionsFeed