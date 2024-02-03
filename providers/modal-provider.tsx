'use client'



import DeleteModal from "@/components/(modals)/delete-modal"
import { useEffect, useState } from "react"

type Props = {}

const ModalProvider = (props: Props) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(()=>{setIsMounted(true)},[])
    if(!isMounted) return null
  return (
    <>
    
    <DeleteModal/>
   
    </>
  )
}

export default ModalProvider