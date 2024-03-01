'use client'

import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

type Props = {
  mainDahsboard?:boolean
}

const FilterComponent = ({mainDahsboard}: Props) => {
    const [searchValue, setSearchValue] = useState('')
    const router = useRouter()

    const handlePush = ()=>{
router.push(`?bookingCode=${searchValue}`)
setSearchValue('')
    }

    const handleReset = ()=>{
        router.push(mainDahsboard ? '/dashboard' : '/dashboard/bookings')
        setSearchValue('')
    }

  return (
    <div className='flex items-center gap-2'>
        <Input placeholder='Booking Code' value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} />
        <Button variant={'site'} onClick={handlePush} disabled={!searchValue} >Search</Button>
        <Button variant={'siteSecondary'} onClick={handleReset}>Reset</Button>

    </div>
  )
}

export default FilterComponent