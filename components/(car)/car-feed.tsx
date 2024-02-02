

import { getCompanyEmail } from '@/lib/utils'

import React from 'react'
import NoResult from '../no-result'
import prisma from '@/lib/prisma'

type Props = {}

const CarFeed = async(props: Props) => {
  
const email = await getCompanyEmail()


const cars = await prisma.car.findMany({
    where:{
        company:{
            email:email as string
        },
        
    },
    orderBy:{
        createdAt:'desc'
    }
}) 



  return (
    <div>
        {!cars.length && <NoResult title='No cars'/>}
        {!!cars.length && <div className='flex gap-3 flex-wrap'>
            {cars.map((car)=><div>
               {}
            </div>)}
            </div>}
    </div>
  )
}

export default CarFeed