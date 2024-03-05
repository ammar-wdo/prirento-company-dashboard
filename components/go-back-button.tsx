'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {url?:string}

const GoBackButton = ({url}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

   
      const segments = pathname.split("/");
      // Remove the last segment
      const withoutLastSegment = segments.slice(0, -1);
      // Join the segments back together
      const newPath = withoutLastSegment.join("/")

    
  return (
    <Link className='rounded-full w-8 h-8 bg-transparent text-black hover:bg-transparent px-4 py-2 ' href={url || newPath} ><ArrowLeft className='mr-2 w-5 h-5'/> </Link>
  )
}

export default GoBackButton