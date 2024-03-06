import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {}

const NotFound = (props: Props) => {
  return (
    <div className='h-screen flex items-center justify-center flex-col gap-2'>
        <div className='md:w-[400px] w-[300px] aspect-square relative -mt-32'>
            <Image src={'/404.png'} className='object-contain' alt='404-placeholder-image' fill />

        </div>
        <h3 className='text-muted-foreground text-sm'>The requested page does not exist!</h3>
        <div className=' flex items-center gap-4'>
<Button asChild variant={'site'}><Link href={'/'}>Home Page</Link></Button>


        </div>
    </div>
  )
}

export default NotFound