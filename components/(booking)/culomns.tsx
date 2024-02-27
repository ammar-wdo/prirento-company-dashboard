"use client"

import { cn, formatDate } from "@/lib/utils"
import { bookingStatusMap } from "@/mappting"
import { Booking } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"



export const columns: ColumnDef<Booking & {car :{carModel:{name:string,carBrand:{brand:string}}}}>[] = [
  {
    accessorKey: "bookingCode",
    header: "Booking Code",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
  
    header: "Car",
    cell:({row})=> <p>{row.original.car.carModel.carBrand.brand}{" "} {row.original.car.carModel.name}</p>
    

  },

  {
    accessorKey:'payNow',
    header: "Price",
    cell:({row})=> <span>{row.original.payLater} AED</span>
    
    
  },
  {
    accessorKey:'startDate',
    header: "Start Date",
    cell:({row})=> <span>{formatDate(row.original.startDate)}</span>
    
    
  },
  {
    accessorKey:'endDate',
    header: "End Date",
    cell:({row})=> <span>{formatDate(row.original.endDate)}</span>
    
    
  },
  {
    accessorKey:'paymentStatus',
    header: "Payment Status",
    cell:({row})=>  <span className={cn(bookingStatusMap[row.original.paymentStatus],'px-4 py-2 ')}>{row.original.paymentStatus}</span>
    
    
  },
]
