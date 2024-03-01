'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

type Props = {url?:string}

const GoBackButton = ({url}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = ()=>{
      const segments = pathname.split("/");
      // Remove the last segment
      const withoutLastSegment = segments.slice(0, -1);
      // Join the segments back together
      const newPath = withoutLastSegment.join("/")
router.push(url || newPath)
    }
  return (
    <Button className='rounded-full w-8 h-8 bg-transparent text-black hover:bg-transparent p-0' onClick={handleClick} ><ArrowLeft className='mr-2 w-5 h-5'/> </Button>
  )
}

export default GoBackButton