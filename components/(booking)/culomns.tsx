"use client"

import { cn, formatDate } from "@/lib/utils"

import { Booking } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"



export const paymentStatusMap:{[key:string]:string} ={
  PENDING:'bg-yellow-500/20 text-yellow-500 border border-yellow-500 rounded-md',
  SUCCEEDED:'bg-green-500/20 text-green-500 border border-green-500 rounded-md',
  EXPIRED:'bg-rose-500/20 text-rose-500 border border-rose-500 rounded-md',
  }
  


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
    cell:({row})=>  <span className={`px-4 py-2 ${paymentStatusMap[row.original.paymentStatus]} `}>{row.original.paymentStatus}</span>
    
    
  },
]
