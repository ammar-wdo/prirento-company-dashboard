import prisma from '@/lib/prisma'
import React from 'react'
import NoResult from '../no-result'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import ClientModalButton from '../client-modal-button'
import { deleteCarAvailability } from '@/actions/car-availability-actions'
import { formatDate, getCompany } from '@/lib/utils'
import { notFound } from 'next/navigation'
import NavigatorButton from '../navigator-button'

type Props = {
    carId:string
}

const CarAvailabilityFeed = async({carId}: Props) => {
  const company = await getCompany()
    const availabilities = await prisma.carAvailability.findMany({
        where:{
            carId,
car:{companyId:company?.id}
        },orderBy:{createdAt:'desc'}
    })

    if(!availabilities) notFound()
  return (
    <div>
        {!availabilities.length && <NoResult title='No blocking dates added' />}
        {!!availabilities.length && <div className='bg-white  mt-12 border rounded-md'><Table >
 
  <TableHeader>
    <TableRow>
      <TableHead className="">Label</TableHead>
      <TableHead>Start date</TableHead>
      <TableHead>End date</TableHead>
      <TableHead>Actions</TableHead>
    
    </TableRow>
  </TableHeader>
  <TableBody>
 {availabilities.map(availability=>   <TableRow key={availability.id} className='capitalize'>
      <TableCell className="font-medium">{availability.label || "N/A"}</TableCell>
      <TableCell>{formatDate(availability.startDate)}</TableCell>
      <TableCell>{formatDate(availability.endDate)}</TableCell>
      <TableCell className="text-right"><div className='flex items-center gap-2'>
      <NavigatorButton
      href={`/dashboard/cars/${availability.carId}/availability/${availability.id}`}
     
       
      >
        Edit
      </NavigatorButton>
      <ClientModalButton
   
        destructive
        modalInputs={{
          toDelete: true,
          modal: "delete",
          deleteId: availability.id,
          deleteFunction: deleteCarAvailability,
        }}
      >
        Delete
      </ClientModalButton>
        </div></TableCell>
    </TableRow>)}
  </TableBody>
</Table></div>}
    </div>
    
  )
}

export default CarAvailabilityFeed



