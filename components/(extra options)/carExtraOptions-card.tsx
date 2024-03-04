import { CarExtraOption } from '@prisma/client'
import Image from 'next/image'
import React from 'react'
import ClientModalButton from '../client-modal-button'

import { cn } from '@/lib/utils'
import { statusMap } from '../mapping'
import { deleteCarExtraOption } from '@/actions/car-extraOptions-actions'
import NavigatorButton from '../navigator-button'
import Link from 'next/link'


type Props = {
    extraOption:CarExtraOption
}

const CarExtraoptionCard = ({extraOption}: Props) => {
  return (
    <div
    key={extraOption.id}
    className="min-w-[250px] rounded-md border flex flex-col bg-white overflow-hidden"
  >
    <div className="relative w-full aspect-video">
      <Image
        src={extraOption.logo}
        fill
        alt="logo"
        className="object-cover"
      />
    </div>
    <div className="p-4 mt-3 w-full">
      <h3 className="font-medium capitalize text-muted-foreground">
        {extraOption.label}
      </h3>
      <p className=" text-sm ">AED {extraOption.price}</p>
      <div className={cn('uppercase p-2 text-sm my-6 w-fit',statusMap[extraOption.status])}>{extraOption.status}</div>
      <div className="mt-auto w-full flex gap-1">
        <Link
        className='w-full bg-black text-white flex items-center justify-center rounded-lg'
        href={`/dashboard/cars/${extraOption.carId}/extra-options/${extraOption.id}`}
        >
          Edit
        </Link>
        <ClientModalButton
        className='w-full'
        destructive
          modalInputs={{
            toDelete: true,
            deleteFunction: deleteCarExtraOption,
            deleteId: extraOption.id,
            modal: "delete",
          }}
        >
          Delete
        </ClientModalButton>
      </div>
    </div>
  </div>
  )
}

export default CarExtraoptionCard