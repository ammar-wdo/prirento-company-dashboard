'use client'
import {
    Sheet,
    SheetContent,

    SheetTrigger,
  } from "@/components/ui/sheet"

import { Menu } from "lucide-react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type Props = {children:React.ReactNode}

const MobileSheet = ({children}: Props) => {
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{setMounted(true)},[])

  const [open,setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(()=>{
    setOpen(false)
  },[pathname])
  
  if(!mounted) return null
  return (
    <Sheet open={open} onOpenChange={setOpen} >
    <SheetTrigger className="absolute top-8 right-8 rounded-full p-2 w-8 h-8 bg-main flex items-center justify-center lg:hidden"><Menu className="text-white"/></SheetTrigger>
    <SheetContent style={{color:'white'}}  className="bg-main border-none w-full " side={'left'}>
  
      {children}
   
    
   
    </SheetContent>
  </Sheet>
  )
}

export default MobileSheet