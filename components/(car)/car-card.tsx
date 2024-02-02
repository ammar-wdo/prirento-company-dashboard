

import { Car } from '@prisma/client'
import Image from 'next/image'
import React from 'react'

type Props = {
    car:Car
}

const CarCard = ({car}: Props) => {
  return (
    <div className='w-[300px] rounded-lg overflow-hidden border'>
        <div className='w-full aspect-video relative'>
            <Image src={car.gallary[0]} fill alt='galary' />

        </div>
        
    </div>
  )
}

export default CarCard