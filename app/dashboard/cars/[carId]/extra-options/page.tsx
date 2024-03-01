import ExtraOptionsFeed from '@/components/(extra options)/extra-options-feed'
import GoBackButton from '@/components/go-back-button'
import Heading from '@/components/heading'
import NavigatorButton from '@/components/navigator-button'
import prisma from '@/lib/prisma'
import { getCompany } from '@/lib/utils'
import { Plus } from 'lucide-react'
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
      <div className='flex md:justify-between md:flex-row flex-col gap-3 w-full'>
      <Heading
        title={
          
           `${car?.carModel.carBrand.brand} ${car?.carModel.name} - Extra options`
      
        }
        description={
       "Create extra options"
        }
      />
      <div className='flex flex-col gap-2'>
      <NavigatorButton href={`/dashboard/cars/${params.carId}/extra-options/new`}><Plus className='mr-2 h-3 w-3' /> Create extra option</NavigatorButton>
      <GoBackButton url='/dashboard/cars'/>
      </div>
    
      </div>
       

        <div className='mt-12'>
          <ExtraOptionsFeed carId={params.carId}/>
        </div>
    </div>
  )
}

export default page