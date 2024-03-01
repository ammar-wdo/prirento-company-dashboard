'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {url:string}

const GoBackButton = ({url}: Props) => {
    const router = useRouter()

    const handleClick = ()=>{
router.push(url)
    }
  return (
    <Button onClick={handleClick} ><ArrowLeft className='mr-2'/> Go Back</Button>
  )
}

export default GoBackButton