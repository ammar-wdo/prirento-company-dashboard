'use client' // Error components must be Client Components
 
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className='h-screen flex items-center justify-center flex-col gap-2'>
    <div className='md:w-[400px] w-[300px] aspect-square relative'>
        <Image src={'/error.png'} className='object-contain' alt='404-placeholder-image' fill />

    </div>
    <h3 className='text-muted-foreground'>Internal server error !</h3>
    <div className='mt-12 flex items-center gap-4'>
<Button asChild variant={'site'}><Link href={'/'}>Home Page</Link></Button>
<Button onClick={()=>reset()}  variant={'site'}>Try Again</Button>

    </div>
</div>
  )
}