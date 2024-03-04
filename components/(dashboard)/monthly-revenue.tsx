import prisma from '@/lib/prisma'
import { cn, currentMonthRange, getCompanyEmail, previousMonthRange, revenueMessage } from '@/lib/utils'
import React from 'react'
import Widjet from '../widjet'
import { ArrowDown, ArrowUp, DollarSign } from 'lucide-react'

type Props = {}

const MonthlyRevenue = async(props: Props) => {
    const email = await getCompanyEmail()

    // extract current month range
const {firstDayOfCurrentMonth,firstDayOfNextMonth} = currentMonthRange()

//current month revenue
const currentMonthRevenue = await prisma.booking.aggregate({
    _sum: {
   payLater:true
    },
    where: {
      startDate: {
        gte: firstDayOfCurrentMonth,
        lt: firstDayOfNextMonth,
      },
  car:{
    company:{
        email:email as string
    }
  },
  bookingStatus:'ACTIVE',
  paymentStatus:'SUCCEEDED'
    },
  });

  //extract previous month date
  const {firstDayOfPreviousMonth,lastDayOfPreviousMonth} = previousMonthRange()
  //previous month revenue
  const previousMonthRevenue = await prisma.booking.aggregate({
    _sum: {
      payLater: true
    },
    where: {
      startDate: {
        gte: firstDayOfPreviousMonth,
        lt: lastDayOfPreviousMonth,
      },
      car: {
        company: {
          email: email as string
        }
      },
      bookingStatus: 'ACTIVE',
      paymentStatus: 'SUCCEEDED'
    },
  });


  const revenueCurrentMonth = currentMonthRevenue._sum.payLater || 0;
const revenuePreviousMonth = previousMonthRevenue._sum.payLater || 0;

const {message,color,status} = revenueMessage(revenuePreviousMonth,revenueCurrentMonth)



  return (
   <Widjet title='Monthly Revenue'>
    <div className='flex justify-between md:items-center md:flex-row flex-col gap-1'>
    <div className='flex items-center gap-4'><span className='font-bold'>AED</span> {currentMonthRevenue._sum.payLater?.toFixed(2)}</div> 
    <p className={cn('flex items-center gap-1 text-sm',color)}>{status==='increase' ? <ArrowUp/> : status ==='decrease' ? <ArrowDown/> :''}{message}</p>
    </div>
 
    </Widjet>
  )
}

export default MonthlyRevenue