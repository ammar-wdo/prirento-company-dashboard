import ExtraOptionsFeed from '@/components/(extra options)/extra-options-feed'
import Heading from '@/components/heading'
import NavigatorButton from '@/components/navigator-button'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import React from 'react'

type Props = {params:{carId:string}}

export const revalidate = 0

const page = async({params}: Props) => {
  const company = await getCompany()
  const car = await prisma.car.findUnique({
    where:{
      id:params.carId,
      companyId:company?.id
    },
    include:{
      carModel:{
        include:{
          carBrand:{
            select:{
              brand:true
            }
          }
        }
      }
    }
  })
  return (
    <div>
      <div className='flex items-center justify-between'>
      <Heading
        title={
          
           `${car?.carModel.carBrand.brand} ${car?.carModel.name} - Extra options`
      
        }
        description={
       "Create extra options"
        }
      />
      <NavigatorButton href={`/dashboard/cars/${params.carId}/extra-options/new`}>Create extra option</NavigatorButton>
      </div>
       

        <div className='mt-12'>
          <ExtraOptionsFeed carId={params.carId}/>
        </div>
    </div>
  )
}

export default page